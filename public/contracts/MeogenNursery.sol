// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title Meogen Nursery
/// @notice Mix two cats. Each organ fifty-fifty. Six percent mutant per organ.
/// Mix fee goes to the Vat — never an EOA. One-hour cooldown. Founder cap 500.
/// On-chain image is a genome seal. Illustrated mutant cards live on the site.
/// This is the kit registry (symbol KIT), not the $MEOGEN Pons ticker.
/// @dev Compiler 0.8.24, optimizer 200 runs, Robinhood Chain 4663.
/// @custom:website https://meogen.xyz
/// @custom:twitter https://x.com/meogenXYZ
/// @custom:telegram https://t.me/meogenXYZ
/// @custom:github https://github.com/meogenxyz/meogen
contract MeogenNursery {
    /// @notice Deployer. May set the vat, the mix fee, and a new owner.
    address public owner;
    /// @notice Contract that receives every mix fee. Must have code.
    address payable public vat;

    uint256 public mixFee = 0.0003 ether;
    uint64 public constant COOLDOWN = 1 hours;
    uint256 public constant FOUNDER_CAP = 500;
    uint16 public constant MUTANT_BPS = 600;

    uint256 public nextId = 1;
    uint256 public founderMinted;

    mapping(uint256 => address) public ownerOf;
    mapping(uint256 => uint256) public genome; // packed: head body tail legs gen flags entropy
    mapping(uint256 => uint256) public damOf;
    mapping(uint256 => uint256) public sireOf;
    mapping(uint256 => uint64) public lastMixAt; // by token id
    mapping(address => uint64) public lastMixBy;

    string public constant name = "Meogen Kit";
    string public constant symbol = "KIT";
    string public constant description =
        "The gene that mews. Mix original mutant cats. Four organs. Keep the wrong ones.";
    string public constant website = "https://meogen.xyz";
    string public constant twitter = "https://x.com/meogenXYZ";
    string public constant telegram = "https://t.me/meogenXYZ";
    string public constant github = "https://github.com/meogenxyz/meogen";

    event Transfer(address indexed from, address indexed to, uint256 indexed id);
    event Mixed(uint256 indexed kitten, uint256 dam, uint256 sire, uint256 genome);
    event VatSet(address vat);
    event MixFeeSet(uint256 fee);

    modifier onlyOwner() {
        require(msg.sender == owner, "owner");
        _;
    }

    constructor(address payable _vat) {
        _requireVat(_vat);
        owner = msg.sender;
        vat = _vat;
    }

    /// @notice Site, X, Telegram, GitHub.
    function socials()
        external
        pure
        returns (string memory, string memory, string memory, string memory)
    {
        return (website, twitter, telegram, github);
    }

    /// @notice Point mix fees at a new vat. Must be a contract, never a wallet.
    function setVat(address payable _vat) external onlyOwner {
        _requireVat(_vat);
        vat = _vat;
        emit VatSet(_vat);
    }

    /// @notice Change the mix price in wei.
    function setMixFee(uint256 fee) external onlyOwner {
        mixFee = fee;
        emit MixFeeSet(fee);
    }

    /// @notice Hand the nursery to a new owner. Zero address refused.
    function transferOwnership(address next) external onlyOwner {
        require(next != address(0), "zero");
        owner = next;
    }

    /// @notice Kits minted so far.
    function totalSupply() external view returns (uint256) {
        return nextId - 1;
    }

    /// @notice Free founder mint. Cycles the six palettes. Cap 500.
    function mintFounder() external returns (uint256 id) {
        require(founderMinted < FOUNDER_CAP, "cap");
        founderMinted += 1;
        id = nextId++;
        uint256 g = _founderGenome(id, msg.sender);
        genome[id] = g;
        ownerOf[id] = msg.sender;
        emit Transfer(address(0), msg.sender, id);
    }

    /// @notice Mix dam and sire. Fee in ETH goes to the Vat. One hour sleep per mixer.
    function mix(uint256 dam, uint256 sire) external payable returns (uint256 id) {
        require(ownerOf[dam] == msg.sender && ownerOf[sire] == msg.sender, "not yours");
        require(dam != sire, "same");
        require(msg.value >= mixFee, "fee");
        require(block.timestamp >= uint256(lastMixBy[msg.sender]) + COOLDOWN, "sleep");

        lastMixBy[msg.sender] = uint64(block.timestamp);
        lastMixAt[dam] = uint64(block.timestamp);
        lastMixAt[sire] = uint64(block.timestamp);

        id = nextId++;
        uint256 g = _mixGenomes(genome[dam], genome[sire], id);
        genome[id] = g;
        damOf[id] = dam;
        sireOf[id] = sire;
        ownerOf[id] = msg.sender;
        emit Mixed(id, dam, sire, g);
        emit Transfer(address(0), msg.sender, id);

        if (msg.value > 0) {
            (bool ok, ) = vat.call{value: msg.value}("");
            require(ok, "vat");
        }
    }

    /// @notice Send a kit. No marketplace approve. Owner only.
    function transfer(address to, uint256 id) external {
        require(ownerOf[id] == msg.sender, "not yours");
        require(to != address(0), "zero");
        ownerOf[id] = to;
        emit Transfer(msg.sender, to, id);
    }

    /// @notice Genome seal as a data URI. Illustrated cards stay on meogen.xyz.
    function tokenURI(uint256 id) external view returns (string memory) {
        require(ownerOf[id] != address(0), "none");
        uint256 g = genome[id];
        return string.concat("data:application/json,", _json(id, g));
    }

    /// @notice Coat id for one organ. Slot 0 head, 1 body, 2 tail, 3 legs.
    function organ(uint256 g, uint8 slot) public pure returns (uint8) {
        return uint8((g >> (uint256(slot) * 8)) & 0xff);
    }

    /// @notice Generation byte. Founders are 0.
    function generation(uint256 g) public pure returns (uint8) {
        return uint8((g >> 32) & 0xff);
    }

    /// @notice True if any organ rolled the 6% mutant.
    function isMutant(uint256 g) public pure returns (bool) {
        return (g >> 40) & 1 == 1;
    }

    /// @notice True if the four organs do not share one coat.
    function isChimera(uint256 g) public pure returns (bool) {
        return (g >> 41) & 1 == 1;
    }

    // --- internals ---

    function _requireVat(address _vat) internal view {
        require(_vat != address(0) && _vat.code.length > 0, "vat");
    }

    function _founderGenome(uint256 id, address minter) internal view returns (uint256 g) {
        // Six founder palettes, matching the site.
        uint8[4][6] memory palettes = [
            [uint8(1), 1, 1, 1],
            [0, 0, 0, 0],
            [2, 6, 2, 6],
            [3, 8, 3, 8],
            [5, 5, 4, 5],
            [7, 0, 7, 9]
        ];
        uint256 i = (id + uint256(uint160(minter))) % 6;
        uint8 h = palettes[i][0];
        uint8 b = palettes[i][1];
        uint8 t = palettes[i][2];
        uint8 l = palettes[i][3];
        g = uint256(h);
        g |= uint256(b) << 8;
        g |= uint256(t) << 16;
        g |= uint256(l) << 24;
        if (h != b || b != t || t != l) g |= uint256(1) << 41;
        g |= (uint256(keccak256(abi.encodePacked(id, minter, block.prevrandao))) & 0xffff_ffff_ffff_ffff) << 48;
    }

    function _mixGenomes(uint256 dam, uint256 sire, uint256 id) internal view returns (uint256 g) {
        bool mutant;
        bool chimera;
        uint8 first;
        bytes32 seed = keccak256(abi.encodePacked(dam, sire, id, msg.sender, block.prevrandao, block.timestamp));
        for (uint8 slot; slot < 4; slot++) {
            uint256 roll = uint256(keccak256(abi.encodePacked(seed, slot)));
            uint8 coat = uint8((roll & 1 == 0) ? organ(dam, slot) : organ(sire, slot));
            if (uint16(roll >> 8) % 10_000 < MUTANT_BPS) {
                mutant = true;
                if (uint16(roll >> 40) % 100 < 45) coat = 11;
                else coat = uint8((roll >> 24) % 11);
            }
            g |= uint256(coat) << (uint256(slot) * 8);
            if (slot == 0) first = coat;
            else if (coat != first) chimera = true;
        }
        uint8 gen = generation(dam);
        uint8 gs = generation(sire);
        if (gs > gen) gen = gs;
        if (gen < 255) gen += 1;
        g |= uint256(gen) << 32;
        if (mutant) g |= uint256(1) << 40;
        if (chimera) g |= uint256(1) << 41;
        g |= (uint256(seed) & 0xffff_ffff_ffff_ffff) << 48;
    }

    function _coatRgb(uint8 id) internal pure returns (string memory) {
        // Must match site COATS[]. rgb() so tokenURI is not broken by # fragments.
        if (id == 0) return "23,18,16";
        if (id == 1) return "212,86,58";
        if (id == 2) return "246,236,220";
        if (id == 3) return "77,106,82";
        if (id == 4) return "106,74,88";
        if (id == 5) return "58,78,104";
        if (id == 6) return "232,201,160";
        if (id == 7) return "196,122,58";
        if (id == 8) return "111,143,116";
        if (id == 9) return "42,35,32";
        if (id == 10) return "255,246,238";
        return "201,160,106";
    }

    function _json(uint256 id, uint256 g) internal pure returns (string memory) {
        string memory h = _coatRgb(organ(g, 0));
        string memory b = _coatRgb(organ(g, 1));
        string memory t = _coatRgb(organ(g, 2));
        string memory l = _coatRgb(organ(g, 3));
        string memory svg = string.concat(
            "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 320'>",
            "<rect width='320' height='320' fill='rgb(18,16,26)'/>",
            "<rect x='16' y='16' width='288' height='288' rx='18' fill='rgb(30,26,28)' stroke='rgb(212,86,58)' stroke-width='3'/>",
            "<ellipse cx='230' cy='150' rx='48' ry='18' fill='rgb(", t, ")'/>",
            "<rect x='90' y='168' width='28' height='70' rx='8' fill='rgb(", l, ")'/>",
            "<rect x='160' y='168' width='28' height='70' rx='8' fill='rgb(", l, ")'/>",
            "<rect x='80' y='120' width='120' height='70' rx='28' fill='rgb(", b, ")'/>",
            "<circle cx='175' cy='110' r='36' fill='rgb(", h, ")'/>",
            "<polygon points='150,92 158,68 172,96' fill='rgb(", h, ")'/>",
            "<polygon points='188,92 210,68 198,98' fill='rgb(", h, ")'/>",
            "<text x='160' y='292' text-anchor='middle' fill='rgb(246,236,220)' font-size='14' font-family='serif'>Meogen #",
            _u(id),
            "</text></svg>"
        );
        return string.concat(
            '{"name":"Meogen Kit #',
            _u(id),
            '","description":"The gene that mews. Mix original mutant cats. https://meogen.xyz","image":"data:image/svg+xml;utf8,',
            svg,
            '"}'
        );
    }

    function _u(uint256 n) internal pure returns (string memory) {
        if (n == 0) return "0";
        uint256 len;
        uint256 m = n;
        while (m != 0) {
            len++;
            m /= 10;
        }
        bytes memory b = new bytes(len);
        while (n != 0) {
            len--;
            b[len] = bytes1(uint8(48 + (n % 10)));
            n /= 10;
        }
        return string(b);
    }
}
