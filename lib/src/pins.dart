import 'dart:ui' as ui;

import 'package:flutter/material.dart' show Icons;
import 'package:flutter/widgets.dart' show IconData;

/// A round pin: an icon in white on a coloured disc.
class VmapPin {
  const VmapPin(this.icon, this.color);

  final IconData icon;
  final ui.Color color;
}

/// Draws places of interest as round pins instead of the style's own icons.
///
/// A style names an icon per place, for OpenMapTiles styles the place's class:
/// `restaurant`, `cafe`, `lodging`. [byIcon] gives the pin for a name. Icons
/// with no pin, such as road shields and arrows, are drawn as the style has
/// them.
///
/// The icons are glyphs of an icon font, so the app has to bundle that font.
/// For the standard set that means `uses-material-design: true` in the app's
/// pubspec.
class VmapPins {
  const VmapPins({
    this.byIcon = _standard,
    this.other = const VmapPin(Icons.place_rounded, ui.Color(0xFF8A93A0)),
    this.size = 22,
  });

  /// The standard set at the standard size.
  static const VmapPins standard = VmapPins();

  /// The standard pins by icon name: food, cafes, hotels, shops, parks,
  /// sights, health, transport. Spread it into [byIcon] to change a few.
  static const Map<String, VmapPin> standardIcons = _standard;

  final Map<String, VmapPin> byIcon;

  /// The pin of a place whose icon has none in [byIcon]. Null leaves those
  /// places with the style's icon.
  final VmapPin? other;

  /// The diameter in logical pixels.
  final double size;
}

/// How the labels find a place's pin; not part of the public API.
extension PinLookup on VmapPins {
  /// The pin for a style's icon name. [place] says the symbol comes from the
  /// style's layer of places, which is where `other` applies.
  VmapPin? resolve(String icon, {required bool place}) {
    final exact = byIcon[icon];
    if (exact != null) return exact;
    final cut = icon.lastIndexOf('_');
    if (cut > 0 && int.tryParse(icon.substring(cut + 1)) != null) {
      final sized = byIcon[icon.substring(0, cut)];
      if (sized != null) return sized;
    }
    return place ? other : null;
  }
}

const ui.Color _food = ui.Color(0xFFF2762E);
const ui.Color _drink = ui.Color(0xFFB8672E);
const ui.Color _stay = ui.Color(0xFFE5488B);
const ui.Color _shop = ui.Color(0xFF2F7DE1);
const ui.Color _green = ui.Color(0xFF1F9D62);
const ui.Color _sight = ui.Color(0xFF7B61FF);
const ui.Color _health = ui.Color(0xFFE5484D);
const ui.Color _move = ui.Color(0xFF0E9AA7);
const ui.Color _civic = ui.Color(0xFF5F6B7A);

/// Pins for the place classes of OpenMapTiles styles.
const Map<String, VmapPin> _standard = {
  'restaurant': VmapPin(Icons.restaurant_rounded, _food),
  'fast_food': VmapPin(Icons.fastfood_rounded, _food),
  'bakery': VmapPin(Icons.bakery_dining_rounded, _food),
  'ice_cream': VmapPin(Icons.icecream_rounded, _food),
  'cafe': VmapPin(Icons.local_cafe_rounded, _drink),
  'bar': VmapPin(Icons.local_bar_rounded, _drink),
  'beer': VmapPin(Icons.sports_bar_rounded, _drink),
  'alcohol_shop': VmapPin(Icons.liquor_rounded, _drink),
  'lodging': VmapPin(Icons.hotel_rounded, _stay),
  'campsite': VmapPin(Icons.cabin_rounded, _stay),
  'shop': VmapPin(Icons.shopping_bag_rounded, _shop),
  'grocery': VmapPin(Icons.local_grocery_store_rounded, _shop),
  'clothing_store': VmapPin(Icons.checkroom_rounded, _shop),
  'hairdresser': VmapPin(Icons.content_cut_rounded, _shop),
  'laundry': VmapPin(Icons.local_laundry_service_rounded, _shop),
  'florist': VmapPin(Icons.local_florist_rounded, _shop),
  'furniture': VmapPin(Icons.chair_rounded, _shop),
  'bank': VmapPin(Icons.account_balance_wallet_rounded, _shop),
  'atm': VmapPin(Icons.local_atm_rounded, _shop),
  'park': VmapPin(Icons.park_rounded, _green),
  'garden': VmapPin(Icons.local_florist_rounded, _green),
  'playground': VmapPin(Icons.toys_rounded, _green),
  'pitch': VmapPin(Icons.sports_soccer_rounded, _green),
  'golf': VmapPin(Icons.golf_course_rounded, _green),
  'stadium': VmapPin(Icons.stadium_rounded, _green),
  'swimming': VmapPin(Icons.pool_rounded, _green),
  'zoo': VmapPin(Icons.pets_rounded, _green),
  'cemetery': VmapPin(Icons.yard_rounded, _green),
  'attraction': VmapPin(Icons.star_rounded, _sight),
  'museum': VmapPin(Icons.museum_rounded, _sight),
  'art_gallery': VmapPin(Icons.palette_rounded, _sight),
  'monument': VmapPin(Icons.account_balance_rounded, _sight),
  'castle': VmapPin(Icons.castle_rounded, _sight),
  'theatre': VmapPin(Icons.theater_comedy_rounded, _sight),
  'cinema': VmapPin(Icons.movie_rounded, _sight),
  'music': VmapPin(Icons.music_note_rounded, _sight),
  'place_of_worship': VmapPin(Icons.temple_buddhist_rounded, _sight),
  'information': VmapPin(Icons.info_rounded, _sight),
  'hospital': VmapPin(Icons.local_hospital_rounded, _health),
  'pharmacy': VmapPin(Icons.local_pharmacy_rounded, _health),
  'doctors': VmapPin(Icons.medical_services_rounded, _health),
  'dentist': VmapPin(Icons.medical_services_rounded, _health),
  'veterinary': VmapPin(Icons.pets_rounded, _health),
  'bus': VmapPin(Icons.directions_bus_rounded, _move),
  'railway': VmapPin(Icons.train_rounded, _move),
  'aerialway': VmapPin(Icons.airline_stops_rounded, _move),
  'airport': VmapPin(Icons.flight_rounded, _move),
  'harbor': VmapPin(Icons.directions_boat_rounded, _move),
  'car': VmapPin(Icons.directions_car_rounded, _move),
  'fuel': VmapPin(Icons.local_gas_station_rounded, _move),
  'parking': VmapPin(Icons.local_parking_rounded, _move),
  'school': VmapPin(Icons.school_rounded, _civic),
  'college': VmapPin(Icons.school_rounded, _civic),
  'library': VmapPin(Icons.local_library_rounded, _civic),
  'post': VmapPin(Icons.local_post_office_rounded, _civic),
  'town_hall': VmapPin(Icons.account_balance_rounded, _civic),
  'police': VmapPin(Icons.local_police_rounded, _civic),
  'fire_station': VmapPin(Icons.local_fire_department_rounded, _civic),
  'toilets': VmapPin(Icons.wc_rounded, _civic),
};

/// Clear space around the disc in a pin's image, for its shadow.
const double pinPad = 4;

/// Draws [pin] into an image [size] plus [pinPad] on every side, at
/// [devicePixelRatio].
ui.Image drawPin(VmapPin pin, double size, double devicePixelRatio) {
  final extent = size + pinPad * 2;
  final recorder = ui.PictureRecorder();
  final canvas = ui.Canvas(recorder)..scale(devicePixelRatio);
  final centre = ui.Offset(extent / 2, extent / 2);
  final ring = size * 0.09;
  canvas
    ..drawCircle(
      centre.translate(0, 1),
      size / 2,
      ui.Paint()
        ..color = const ui.Color(0x47000000)
        ..maskFilter = const ui.MaskFilter.blur(ui.BlurStyle.normal, 1.6),
    )
    ..drawCircle(
      centre,
      size / 2,
      ui.Paint()
        ..color = const ui.Color(0xFFFFFFFF)
        ..isAntiAlias = true,
    )
    ..drawCircle(
      centre,
      size / 2 - ring,
      ui.Paint()
        ..color = pin.color
        ..isAntiAlias = true,
    );
  final glyph = size * 0.56;
  final family = pin.icon.fontPackage == null
      ? pin.icon.fontFamily
      : 'packages/${pin.icon.fontPackage}/${pin.icon.fontFamily}';
  final builder =
      ui.ParagraphBuilder(
          ui.ParagraphStyle(
            textAlign: ui.TextAlign.center,
            fontFamily: family,
            fontSize: glyph,
            height: 1,
          ),
        )
        ..pushStyle(
          ui.TextStyle(
            color: const ui.Color(0xFFFFFFFF),
            fontFamily: family,
            fontSize: glyph,
            height: 1,
          ),
        )
        ..addText(String.fromCharCode(pin.icon.codePoint));
  final paragraph = builder.build()
    ..layout(ui.ParagraphConstraints(width: extent));
  canvas.drawParagraph(
    paragraph,
    ui.Offset(0, (extent - paragraph.height) / 2),
  );
  paragraph.dispose();
  final picture = recorder.endRecording();
  final pixels = (extent * devicePixelRatio).ceil();
  final image = picture.toImageSync(pixels, pixels);
  picture.dispose();
  return image;
}
