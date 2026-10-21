import 'dart:ui';

import 'package:flutter/foundation.dart';

/// Where each colour of a [VmapPalette] sits in [PaletteTones.tones].
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

/// The colours of the built in style, by what they paint.
@immutable
class VmapPalette {
  const VmapPalette({
    required this.background,
    required this.residential,
    required this.commercial,
    required this.school,
    required this.hospital,
    required this.sand,
    required this.grass,
    required this.park,
    required this.wood,
    required this.pitch,
    required this.water,
    required this.aeroway,
    required this.pedestrian,
    required this.building,
    required this.casing,
    required this.road,
    required this.roadMajor,
    required this.trunk,
    required this.trunkCasing,
    required this.motorway,
    required this.motorwayCasing,
    required this.path,
    required this.rail,
    required this.boundary,
    required this.labelPrimary,
    required this.labelSecondary,
    required this.labelRoad,
    required this.labelWater,
    required this.halo,
    required this.labelMarker,
  });

  /// Land with nothing else on it.
  final Color background;
  final Color residential;
  final Color commercial;
  final Color school;
  final Color hospital;
  final Color sand;
  final Color grass;
  final Color park;
  final Color wood;
  final Color pitch;
  final Color water;
  final Color aeroway;
  final Color pedestrian;
  final Color building;

  /// The edges of ordinary roads.
  final Color casing;
  final Color road;
  final Color roadMajor;
  final Color trunk;
  final Color trunkCasing;
  final Color motorway;
  final Color motorwayCasing;
  final Color path;
  final Color rail;
  final Color boundary;
  final Color labelPrimary;
  final Color labelSecondary;
  final Color labelRoad;
  final Color labelWater;

  /// The outline around label text.
  final Color halo;

  /// The names written beside the app's markers.
  final Color labelMarker;

  VmapPalette copyWith({
    Color? background,
    Color? residential,
    Color? commercial,
    Color? school,
    Color? hospital,
    Color? sand,
    Color? grass,
    Color? park,
    Color? wood,
    Color? pitch,
    Color? water,
    Color? aeroway,
    Color? pedestrian,
    Color? building,
    Color? casing,
    Color? road,
    Color? roadMajor,
    Color? trunk,
    Color? trunkCasing,
    Color? motorway,
    Color? motorwayCasing,
    Color? path,
    Color? rail,
    Color? boundary,
    Color? labelPrimary,
    Color? labelSecondary,
    Color? labelRoad,
    Color? labelWater,
    Color? halo,
    Color? labelMarker,
  }) => VmapPalette(
    background: background ?? this.background,
    residential: residential ?? this.residential,
    commercial: commercial ?? this.commercial,
    school: school ?? this.school,
    hospital: hospital ?? this.hospital,
    sand: sand ?? this.sand,
    grass: grass ?? this.grass,
    park: park ?? this.park,
    wood: wood ?? this.wood,
    pitch: pitch ?? this.pitch,
    water: water ?? this.water,
    aeroway: aeroway ?? this.aeroway,
    pedestrian: pedestrian ?? this.pedestrian,
    building: building ?? this.building,
    casing: casing ?? this.casing,
    road: road ?? this.road,
    roadMajor: roadMajor ?? this.roadMajor,
    trunk: trunk ?? this.trunk,
    trunkCasing: trunkCasing ?? this.trunkCasing,
    motorway: motorway ?? this.motorway,
    motorwayCasing: motorwayCasing ?? this.motorwayCasing,
    path: path ?? this.path,
    rail: rail ?? this.rail,
    boundary: boundary ?? this.boundary,
    labelPrimary: labelPrimary ?? this.labelPrimary,
    labelSecondary: labelSecondary ?? this.labelSecondary,
    labelRoad: labelRoad ?? this.labelRoad,
    labelWater: labelWater ?? this.labelWater,
    halo: halo ?? this.halo,
    labelMarker: labelMarker ?? this.labelMarker,
  );

  /// Quiet surfaces and inks: paper land, white roads on hairline edges,
  /// teal greens, blue water and a soft gold for highways. Saturated blue is
  /// left for the app's own markers.
  static const light = VmapPalette(
    background: Color(0xFFF4F6F8),
    residential: Color(0xFFF1F3F6),
    commercial: Color(0xFFF0F1F6),
    school: Color(0xFFF6F2E6),
    hospital: Color(0xFFF8ECEE),
    sand: Color(0xFFF3EEDD),
    grass: Color(0xFFCFECDF),
    park: Color(0xFFB6E4D1),
    wood: Color(0xFFA3DBC4),
    pitch: Color(0xFF90D2B7),
    water: Color(0xFFB9DFFA),
    aeroway: Color(0xFFE7EAEE),
    pedestrian: Color(0xFFFAFBFC),
    building: Color(0xFFE9ECF0),
    casing: Color(0xFFDADFE5),
    road: Color(0xFFFFFFFF),
    roadMajor: Color(0xFFFFFFFF),
    trunk: Color(0xFFFFF4D6),
    trunkCasing: Color(0xFFEAD9A8),
    motorway: Color(0xFFFFE9B0),
    motorwayCasing: Color(0xFFE6C878),
    path: Color(0xFFFFFFFF),
    rail: Color(0xFFCBD1D8),
    boundary: Color(0xFFA9B1BC),
    labelPrimary: Color(0xFF4B515B),
    labelSecondary: Color(0xFF8C929C),
    labelRoad: Color(0xFF7C828C),
    labelWater: Color(0xFF0A84CC),
    halo: Color(0xFFFFFFFF),
    labelMarker: Color(0xFF0073BF),
  );

  static const dark = VmapPalette(
    background: Color(0xFF121212),
    residential: Color(0xFF141414),
    commercial: Color(0xFF151517),
    school: Color(0xFF181713),
    hospital: Color(0xFF191516),
    sand: Color(0xFF191812),
    grass: Color(0xFF142820),
    park: Color(0xFF18352A),
    wood: Color(0xFF153026),
    pitch: Color(0xFF1D4233),
    water: Color(0xFF062E46),
    aeroway: Color(0xFF191919),
    pedestrian: Color(0xFF171717),
    building: Color(0xFF1B1B1C),
    casing: Color(0xFF080808),
    road: Color(0xFF262626),
    roadMajor: Color(0xFF303030),
    trunk: Color(0xFF3A3526),
    trunkCasing: Color(0xFF080808),
    motorway: Color(0xFF4A4128),
    motorwayCasing: Color(0xFF080808),
    path: Color(0xFF222222),
    rail: Color(0xFF323232),
    boundary: Color(0xFF555A62),
    labelPrimary: Color(0xFFA9AEB7),
    labelSecondary: Color(0xFF6C717A),
    labelRoad: Color(0xFF6E737C),
    labelWater: Color(0xFF3FA9EA),
    halo: Color(0xFF121212),
    labelMarker: Color(0xFF58B9F5),
  );

  @override
  bool operator ==(Object other) =>
      other is VmapPalette &&
      other.background == background &&
      other.residential == residential &&
      other.commercial == commercial &&
      other.school == school &&
      other.hospital == hospital &&
      other.sand == sand &&
      other.grass == grass &&
      other.park == park &&
      other.wood == wood &&
      other.pitch == pitch &&
      other.water == water &&
      other.aeroway == aeroway &&
      other.pedestrian == pedestrian &&
      other.building == building &&
      other.casing == casing &&
      other.road == road &&
      other.roadMajor == roadMajor &&
      other.trunk == trunk &&
      other.trunkCasing == trunkCasing &&
      other.motorway == motorway &&
      other.motorwayCasing == motorwayCasing &&
      other.path == path &&
      other.rail == rail &&
      other.boundary == boundary &&
      other.labelPrimary == labelPrimary &&
      other.labelSecondary == labelSecondary &&
      other.labelRoad == labelRoad &&
      other.labelWater == labelWater &&
      other.halo == halo &&
      other.labelMarker == labelMarker;

  @override
  int get hashCode => Object.hashAll(tones);
}

/// The palette as the built in style reads it, indexed by [Tone].
extension PaletteTones on VmapPalette {
  List<int> get tones => [
    background.toARGB32(),
    residential.toARGB32(),
    commercial.toARGB32(),
    school.toARGB32(),
    hospital.toARGB32(),
    sand.toARGB32(),
    grass.toARGB32(),
    park.toARGB32(),
    wood.toARGB32(),
    pitch.toARGB32(),
    water.toARGB32(),
    aeroway.toARGB32(),
    pedestrian.toARGB32(),
    building.toARGB32(),
    casing.toARGB32(),
    road.toARGB32(),
    roadMajor.toARGB32(),
    trunk.toARGB32(),
    trunkCasing.toARGB32(),
    motorway.toARGB32(),
    motorwayCasing.toARGB32(),
    path.toARGB32(),
    rail.toARGB32(),
    boundary.toARGB32(),
    labelPrimary.toARGB32(),
    labelSecondary.toARGB32(),
    labelRoad.toARGB32(),
    labelWater.toARGB32(),
    halo.toARGB32(),
    labelMarker.toARGB32(),
  ];
}
