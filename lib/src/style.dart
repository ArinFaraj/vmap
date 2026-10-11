import 'dart:math' as math;

/// Values at zoom stops, interpolated geometrically so widths grow evenly
/// through a pinch.
class ZoomStops {
  const ZoomStops(this.zooms, this.values);

  final List<double> zooms;
  final List<double> values;

  double at(double zoom) {
    if (zoom <= zooms.first) return values.first;
    if (zoom >= zooms.last) return values.last;
    var i = 1;
    while (zooms[i] < zoom) {
      i++;
    }
    final t = (zoom - zooms[i - 1]) / (zooms[i] - zooms[i - 1]);
    final a = values[i - 1];
    final b = values[i];
    if (a <= 0 || b <= 0) return a + (b - a) * t;
    return a * math.pow(b / a, t);
  }
}

/// Geometry groups a tile is split into. One group is one batch of triangles.
abstract final class Group {
  static const residential = 0;
  static const commercial = 1;
  static const school = 2;
  static const hospital = 3;
  static const sand = 4;
  static const grass = 5;
  static const park = 6;
  static const wood = 7;
  static const pitch = 8;
  static const water = 9;
  static const aeroway = 10;
  static const pedestrian = 11;
  static const building = 12;
  static const fillCount = 13;

  static const waterway = 13;
  static const runway = 14;
  static const taxiway = 15;
  static const path = 16;
  static const service = 17;
  static const minor = 18;
  static const secondary = 19;
  static const primary = 20;
  static const trunk = 21;
  static const motorway = 22;
  static const rail = 23;
  static const bridgeOffset = 8;
  static const pathBridge = path + bridgeOffset;
  static const serviceBridge = service + bridgeOffset;
  static const minorBridge = minor + bridgeOffset;
  static const secondaryBridge = secondary + bridgeOffset;
  static const primaryBridge = primary + bridgeOffset;
  static const trunkBridge = trunk + bridgeOffset;
  static const motorwayBridge = motorway + bridgeOffset;
  static const railBridge = rail + bridgeOffset;
  static const boundaryCountry = 32;
  static const boundaryRegion = 33;
  static const count = 34;

  static bool isLine(int group) => group >= fillCount;
}

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

/// Colours as 0xAARRGGBB, indexed by [Tone].
class VmapPalette {
  const VmapPalette(this.colors);

  final List<int> colors;

  /// Quiet surfaces and inks: paper land, white roads on hairline edges,
  /// teal greens, brand-blue water and a soft gold for highways. Saturated
  /// blue is left for the app's own markers.
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

/// One draw of one geometry group. Zooms are style zooms: the 512 px tile
/// convention, one less than a 256 px slippy-map zoom.
class Pass {
  const Pass(
    this.group,
    this.tone, {
    this.width,
    this.minZoom = 0,
    this.maxZoom = 30,
    this.fadeIn = 0,
  });

  final int group;
  final int tone;

  /// Total stroke width in logical pixels. Null for fills.
  final ZoomStops? width;
  final double minZoom;
  final double maxZoom;

  /// Zoom span over which the pass fades in after [minZoom].
  final double fadeIn;
}

const _trunk = ZoomStops(
  [5, 9, 12, 14, 16, 18, 20],
  [0.9, 1.8, 3.2, 6, 9.5, 17, 32],
);
const _primary = ZoomStops(
  [7, 10, 12, 14, 16, 18, 20],
  [0.7, 1.3, 2.6, 5, 8.5, 16, 30],
);
const _secondary = ZoomStops(
  [9, 11, 13, 14, 16, 18, 20],
  [0.6, 1.1, 2.4, 4, 7.5, 15, 28],
);
const _minor = ZoomStops([11, 13, 14, 16, 18, 20], [0.4, 1.0, 2.2, 6, 13, 26]);
const _service = ZoomStops([12, 14, 16, 18, 20], [0.3, 1.0, 3.2, 7, 14]);
const _path = ZoomStops([13, 15, 17, 20], [0.5, 1.0, 2.2, 6]);
const _rail = ZoomStops([8, 13, 16, 20], [0.4, 0.9, 1.8, 4]);
const _waterway = ZoomStops([8, 12, 15, 20], [0.5, 1.2, 3, 10]);
const _runway = ZoomStops([10, 13, 17], [1.5, 8, 60]);
const _taxiway = ZoomStops([11, 14, 17], [0.6, 2.4, 14]);
const _casingExtra = ZoomStops([6, 12, 15, 18], [1.0, 1.6, 2.2, 3.2]);

class _Cased extends ZoomStops {
  const _Cased(this.inner) : super(const [0], const [0]);

  final ZoomStops inner;

  @override
  double at(double zoom) => inner.at(zoom) + _casingExtra.at(zoom);
}

const List<Pass> passes = [
  Pass(Group.residential, Tone.residential),
  Pass(Group.commercial, Tone.commercial, minZoom: 10),
  Pass(Group.school, Tone.school, minZoom: 10),
  Pass(Group.hospital, Tone.hospital, minZoom: 10),
  Pass(Group.sand, Tone.sand),
  Pass(Group.grass, Tone.grass),
  Pass(Group.park, Tone.park),
  Pass(Group.wood, Tone.wood),
  Pass(Group.pitch, Tone.pitch, minZoom: 12),
  Pass(Group.water, Tone.water),
  Pass(Group.waterway, Tone.water, width: _waterway),
  Pass(Group.aeroway, Tone.aeroway, minZoom: 10),
  Pass(Group.runway, Tone.road, width: _runway, minZoom: 10),
  Pass(Group.taxiway, Tone.road, width: _taxiway, minZoom: 11),
  Pass(Group.pedestrian, Tone.pedestrian),
  Pass(Group.building, Tone.building, minZoom: 13, fadeIn: 0.8),

  Pass(Group.service, Tone.casing, width: _Cased(_service), minZoom: 13.5),
  Pass(Group.minor, Tone.casing, width: _Cased(_minor), minZoom: 11),
  Pass(Group.secondary, Tone.casing, width: _Cased(_secondary)),
  Pass(Group.primary, Tone.casing, width: _Cased(_primary)),
  Pass(Group.trunk, Tone.trunkCasing, width: _Cased(_trunk)),
  Pass(Group.motorway, Tone.motorwayCasing, width: _Cased(_trunk)),
  Pass(
    Group.serviceBridge,
    Tone.casing,
    width: _Cased(_service),
    minZoom: 13.5,
  ),
  Pass(Group.minorBridge, Tone.casing, width: _Cased(_minor), minZoom: 11),
  Pass(Group.secondaryBridge, Tone.casing, width: _Cased(_secondary)),
  Pass(Group.primaryBridge, Tone.casing, width: _Cased(_primary)),
  Pass(Group.trunkBridge, Tone.trunkCasing, width: _Cased(_trunk)),
  Pass(Group.motorwayBridge, Tone.motorwayCasing, width: _Cased(_trunk)),

  Pass(Group.path, Tone.path, width: _path, minZoom: 13.5),
  Pass(Group.service, Tone.road, width: _service, minZoom: 13.5),
  Pass(Group.minor, Tone.road, width: _minor, minZoom: 11),
  Pass(Group.secondary, Tone.roadMajor, width: _secondary),
  Pass(Group.primary, Tone.roadMajor, width: _primary),
  Pass(Group.trunk, Tone.trunk, width: _trunk),
  Pass(Group.motorway, Tone.motorway, width: _trunk),
  Pass(Group.rail, Tone.rail, width: _rail),
  Pass(Group.pathBridge, Tone.path, width: _path, minZoom: 13.5),
  Pass(Group.serviceBridge, Tone.road, width: _service, minZoom: 13.5),
  Pass(Group.minorBridge, Tone.road, width: _minor, minZoom: 11),
  Pass(Group.secondaryBridge, Tone.roadMajor, width: _secondary),
  Pass(Group.primaryBridge, Tone.roadMajor, width: _primary),
  Pass(Group.trunkBridge, Tone.trunk, width: _trunk),
  Pass(Group.motorwayBridge, Tone.motorway, width: _trunk),
  Pass(Group.railBridge, Tone.rail, width: _rail),

  Pass(
    Group.boundaryRegion,
    Tone.boundary,
    width: ZoomStops([4, 8, 12], [0.5, 0.9, 1.4]),
  ),
  Pass(
    Group.boundaryCountry,
    Tone.boundary,
    width: ZoomStops([2, 6, 12], [0.8, 1.4, 2.4]),
  ),
];

abstract final class LabelKind {
  static const place = 0;
  static const road = 1;
  static const water = 2;
}

/// How one class of label is drawn and when it is allowed to appear.
class LabelClass {
  const LabelClass({
    required this.size,
    required this.weight,
    required this.tone,
    required this.minZoom,
    this.maxZoom = 30,
    this.italic = false,
    this.uppercase = false,
    this.letterSpacing = 0,
    this.maxWidthEm = 9,
    required this.priority,
  });

  final double size;
  final int weight;
  final int tone;
  final double minZoom;
  final double maxZoom;
  final bool italic;
  final bool uppercase;
  final double letterSpacing;
  final double maxWidthEm;

  /// Lower wins a collision.
  final int priority;
}

abstract final class LabelClasses {
  static const country = 0;
  static const state = 1;
  static const capital = 2;
  static const city = 3;
  static const town = 4;
  static const village = 5;
  static const suburb = 6;
  static const neighbourhood = 7;
  static const roadMajor = 8;
  static const roadMinor = 9;
  static const water = 10;
  static const marker = 11;

  static const all = <LabelClass>[
    LabelClass(
      size: 13,
      weight: 600,
      tone: Tone.labelPrimary,
      minZoom: 1,
      maxZoom: 7,
      priority: 0,
      maxWidthEm: 7,
    ),
    LabelClass(
      size: 11,
      weight: 600,
      tone: Tone.labelSecondary,
      minZoom: 4.5,
      maxZoom: 8.5,
      priority: 300,
      uppercase: true,
      letterSpacing: 1.2,
    ),
    LabelClass(
      size: 15,
      weight: 600,
      tone: Tone.labelPrimary,
      minZoom: 3,
      maxZoom: 14.2,
      priority: 100,
    ),
    LabelClass(
      size: 14,
      weight: 500,
      tone: Tone.labelPrimary,
      minZoom: 3,
      maxZoom: 14.2,
      priority: 200,
    ),
    LabelClass(
      size: 12.5,
      weight: 500,
      tone: Tone.labelPrimary,
      minZoom: 6,
      maxZoom: 14.5,
      priority: 400,
    ),
    LabelClass(
      size: 12,
      weight: 500,
      tone: Tone.labelPrimary,
      minZoom: 9,
      maxZoom: 15.5,
      priority: 500,
    ),
    LabelClass(
      size: 11.5,
      weight: 500,
      tone: Tone.labelSecondary,
      minZoom: 10.5,
      maxZoom: 15.5,
      priority: 600,
      letterSpacing: 0.4,
    ),
    LabelClass(
      size: 11.5,
      weight: 500,
      tone: Tone.labelSecondary,
      minZoom: 12.5,
      maxZoom: 17,
      priority: 700,
      letterSpacing: 0.2,
    ),
    LabelClass(
      size: 13,
      weight: 500,
      tone: Tone.labelRoad,
      minZoom: 11.5,
      priority: 800,
      maxWidthEm: 60,
    ),
    LabelClass(
      size: 12,
      weight: 500,
      tone: Tone.labelRoad,
      minZoom: 13.2,
      priority: 900,
      maxWidthEm: 60,
    ),
    LabelClass(
      size: 11.5,
      weight: 500,
      tone: Tone.labelWater,
      minZoom: 8,
      priority: 650,
      italic: true,
      letterSpacing: 0.3,
    ),
    LabelClass(
      size: 12.5,
      weight: 600,
      tone: Tone.labelMarker,
      minZoom: 0,
      priority: -1000,
      maxWidthEm: 9,
    ),
  ];
}
