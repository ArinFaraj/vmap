abstract final class Tone {
  static const background = 0;
  static const residential = 1;
  static const commercial = 2;
  static const school = 3;
  static const hospital = 4;
  static const sand = 5;
  static const grass = 6;
  static const park = 7;
  static const wood = 8;
  static const pitch = 9;
  static const water = 10;
  static const aeroway = 11;
  static const pedestrian = 12;
  static const building = 13;
  static const casing = 14;
  static const road = 15;
  static const roadMajor = 16;
  static const trunk = 17;
  static const trunkCasing = 18;
  static const motorway = 19;
  static const motorwayCasing = 20;
  static const path = 21;
  static const rail = 22;
  static const boundary = 23;
  static const labelPrimary = 24;
  static const labelSecondary = 25;
  static const labelRoad = 26;
  static const labelWater = 27;
  static const halo = 28;
  static const labelMarker = 29;
  static const count = 30;
}

/// The colours of the built in style as 0xAARRGGBB, indexed by [Tone].
class VmapPalette {
  const VmapPalette(this.colors);

  final List<int> colors;

  /// Quiet surfaces and inks: paper land, white roads on hairline edges,
  /// teal greens, blue water and a soft gold for highways. Saturated blue is
  /// left for the app's own markers.
  static const light = VmapPalette([
    0xFFF4F6F8,
    0xFFF1F3F6,
    0xFFF0F1F6,
    0xFFF6F2E6,
    0xFFF8ECEE,
    0xFFF3EEDD,
    0xFFCFECDF,
    0xFFB6E4D1,
    0xFFA3DBC4,
    0xFF90D2B7,
    0xFFB9DFFA,
    0xFFE7EAEE,
    0xFFFAFBFC,
    0xFFE9ECF0,
    0xFFDADFE5,
    0xFFFFFFFF,
    0xFFFFFFFF,
    0xFFFFF4D6,
    0xFFEAD9A8,
    0xFFFFE9B0,
    0xFFE6C878,
    0xFFFFFFFF,
    0xFFCBD1D8,
    0xFFA9B1BC,
    0xFF4B515B,
    0xFF8C929C,
    0xFF7C828C,
    0xFF0A84CC,
    0xFFFFFFFF,
    0xFF0073BF,
  ]);

  static const dark = VmapPalette([
    0xFF121212,
    0xFF141414,
    0xFF151517,
    0xFF181713,
    0xFF191516,
    0xFF191812,
    0xFF142820,
    0xFF18352A,
    0xFF153026,
    0xFF1D4233,
    0xFF062E46,
    0xFF191919,
    0xFF171717,
    0xFF1B1B1C,
    0xFF080808,
    0xFF262626,
    0xFF303030,
    0xFF3A3526,
    0xFF080808,
    0xFF4A4128,
    0xFF080808,
    0xFF222222,
    0xFF323232,
    0xFF555A62,
    0xFFA9AEB7,
    0xFF6C717A,
    0xFF6E737C,
    0xFF3FA9EA,
    0xFF121212,
    0xFF58B9F5,
  ]);
}
