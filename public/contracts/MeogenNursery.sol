// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

/// @title Meogen Nursery
/// @notice Mix two cats. Each organ 50/50. 6% mutant per organ.
/// Mix fee goes to Vat — never an EOA. One-hour cooldown. Founder cap 500.
/// Token SVG is a genome seal. Original organ sprites live on meogen.xyz.
/// Not Mewgenics. Compiler 0.8.24, optimizer 200, Robinhood 4663.
contract MeogenNursery {
    address public owner;
    address payable public vat;

    uint256 public mixFee = 0.0003 ether;
    uint64 public constant COOLDOWN = 1 hours;
    uint256 public constant FOUNDER_CAP = 500;
    uint16 public constant MUTANT_BPS = 600;

    uint256 public nextId = 1;
    uint256 public founderMinted;

    mapping(uint256 => address) public ownerOf;
    mapping(uint256 => uint256) public genome; // packed: see pack()
    mapping(uint256 => uint256) public damOf;
    mapping(uint256 => uint256) public sireOf;
    mapping(uint256 => uint64) public lastMixAt; // by token id
    mapping(address => uint64) public lastMixBy;

    string public constant name = "Meogen";
    string public constant symbol = "MEOGEN";

    event Transfer(address indexed from, address indexed to, uint256 indexed id);
    event Mixed(uint256 indexed kitten, uint256 dam, uint256 sire, uint256 genome);
    event VatSet(address vat);
    event MixFeeSet(uint256 fee);

    modifier onlyOwner() {
        require(msg.sender == owner, "owner");
        _;
    }

    constructor(address payable _vat) {
        require(_vat != address(0), "vat");
        owner = msg.sender;
        vat = _vat;
    }

    function setVat(address payable _vat) external onlyOwner {
        require(_vat != address(0), "vat");
        vat = _vat;
        emit VatSet(_vat);
    }

    function setMixFee(uint256 fee) external onlyOwner {
        mixFee = fee;
        emit MixFeeSet(fee);
    }

    function transferOwnership(address next) external onlyOwner {
        require(next != address(0), "zero");
        owner = next;
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

    /// @notice Mix dam + sire. Fee to Vat. Cooldown 1 hour per mixer.
    function mix(uint256 dam, uint256 sire) external payable returns (uint256 id) {
        require(ownerOf[dam] == msg.sender && ownerOf[sire] == msg.sender, "not yours");
        require(dam != sire, "same");
        require(msg.value >= mixFee, "fee");
        require(block.timestamp >= uint256(lastMixBy[msg.sender]) + COOLDOWN, "sleep");

        lastMixBy[msg.sender] = uint64(block.timestamp);
        lastMixAt[dam] = uint64(block.timestamp);
        lastMixAt[sire] = uint64(block.timestamp);

        if (msg.value > 0) {
            (bool ok, ) = vat.call{value: msg.value}("");
            require(ok, "vat");
        }

        id = nextId++;
        uint256 g = _mixGenomes(genome[dam], genome[sire], id);
        genome[id] = g;
        damOf[id] = dam;
        sireOf[id] = sire;
        ownerOf[id] = msg.sender;
        emit Mixed(id, dam, sire, g);
        emit Transfer(address(0), msg.sender, id);
    }

    function transfer(address to, uint256 id) external {
        require(ownerOf[id] == msg.sender, "not yours");
        require(to != address(0), "zero");
        ownerOf[id] = to;
        emit Transfer(msg.sender, to, id);
    }

    function tokenURI(uint256 id) external view returns (string memory) {
        require(ownerOf[id] != address(0), "none");
        uint256 g = genome[id];
        return string.concat("data:application/json,", _json(id, g));
    }

    function organ(uint256 g, uint8 slot) public pure returns (uint8) {
        return uint8((g >> (uint256(slot) * 8)) & 0xff);
    }

    function generation(uint256 g) public pure returns (uint8) {
        return uint8((g >> 32) & 0xff);
    }

    function isMutant(uint256 g) public pure returns (bool) {
        return (g >> 40) & 1 == 1;
    }

    // --- internals ---

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
        g = uint256(palettes[i][0]);
        g |= uint256(palettes[i][1]) << 8;
        g |= uint256(palettes[i][2]) << 16;
        g |= uint256(palettes[i][3]) << 24;
        // gen 0, entropy in high bits
        g |= (uint256(keccak256(abi.encodePacked(id, minter, block.prevrandao))) & 0xffff_ffff_ffff_ffff) << 48;
    }

    function _mixGenomes(uint256 dam, uint256 sire, uint256 id) internal view returns (uint256 g) {
        bool mutant;
        bytes32 seed = keccak256(abi.encodePacked(dam, sire, id, msg.sender, block.prevrandao, block.timestamp));
        for (uint8 slot; slot < 4; slot++) {
            uint256 roll = uint256(keccak256(abi.encodePacked(seed, slot)));
            uint8 coat = uint8((roll & 1 == 0) ? organ(dam, slot) : organ(sire, slot));
            if (uint16(roll >> 8) % 10_000 < MUTANT_BPS) {
                mutant = true;
                coat = uint8((roll >> 24) % 12);
            }
            g |= uint256(coat) << (uint256(slot) * 8);
        }
        uint8 gen = generation(dam);
        uint8 gs = generation(sire);
        if (gs > gen) gen = gs;
        if (gen < 255) gen += 1;
        g |= uint256(gen) << 32;
        if (mutant) g |= uint256(1) << 40;
        g |= (uint256(seed) & 0xffff_ffff_ffff_ffff) << 48;
    }

    function _hex4(uint8 n) internal pure returns (bytes memory) {
        bytes16 lut = "0123456789abcdef";
        bytes memory o = new bytes(2);
        o[0] = lut[n >> 4];
        o[1] = lut[n & 15];
        return o;
    }

    function _coatHex(uint8 id) internal pure returns (string memory) {
        // Must match site COATS[].
        if (id == 0) return "171210";
        if (id == 1) return "d4563a";
        if (id == 2) return "f6ecdc";
        if (id == 3) return "4d6a52";
        if (id == 4) return "6a4a58";
        if (id == 5) return "3a4e68";
        if (id == 6) return "e8c9a0";
        if (id == 7) return "c47a3a";
        if (id == 8) return "6f8f74";
        if (id == 9) return "2a2320";
        if (id == 10) return "fff6ee";
        return "c9a06a";
    }

    function _json(uint256 id, uint256 g) internal pure returns (string memory) {
        string memory h = _coatHex(organ(g, 0));
        string memory b = _coatHex(organ(g, 1));
        string memory t = _coatHex(organ(g, 2));
        string memory l = _coatHex(organ(g, 3));
        string memory svg = string.concat(
            "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 320'>",
            "<rect width='320' height='320' fill='#12101a'/>",
            "<rect x='16' y='16' width='288' height='288' rx='18' fill='#1e1a1c' stroke='#d4563a' stroke-width='3'/>",
            "<ellipse cx='230' cy='150' rx='48' ry='18' fill='#", t, "'/>",
            "<rect x='90' y='168' width='28' height='70' rx='8' fill='#", l, "'/>",
            "<rect x='160' y='168' width='28' height='70' rx='8' fill='#", l, "'/>",
            "<rect x='80' y='120' width='120' height='70' rx='28' fill='#", b, "'/>",
            "<circle cx='175' cy='110' r='36' fill='#", h, "'/>",
            "<polygon points='150,92 158,68 172,96' fill='#", h, "'/>",
            "<polygon points='188,92 210,68 198,98' fill='#", h, "'/>",
            "<text x='160' y='292' text-anchor='middle' fill='#f6ecdc' font-size='14' font-family='serif'>Meogen #",
            _u(id),
            "</text></svg>"
        );
        return string.concat(
            '{"name":"Meogen #',
            _u(id),
            '","description":"The gene that mews. Not Mewgenics.","image":"data:image/svg+xml;utf8,',
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
