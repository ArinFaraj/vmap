import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:vmap/vmap.dart';

void main() {
  const pins = VmapPins.standard;

  test('a pin is found by the icon name and by the name with a size', () {
    expect(pins.resolve('cafe', place: true)!.icon, Icons.local_cafe_rounded);
    expect(
      pins.resolve('airport_11', place: false)!.icon,
      Icons.flight_rounded,
    );
  });

  test('an unknown icon gets the other pin only for a place', () {
    expect(pins.resolve('road_2', place: false), isNull);
    expect(pins.resolve('arrow', place: false), isNull);
    expect(pins.resolve('unheard_of', place: true), pins.other);
    expect(
      const VmapPins(other: null).resolve('unheard_of', place: true),
      isNull,
    );
  });
}
