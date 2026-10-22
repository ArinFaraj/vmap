import 'package:flutter_test/flutter_test.dart';
import 'package:vmap/src/gpu/gpu_shim/shared/glsl_transpile.dart';

void main() {
  test('a uniform struct becomes a std140 block read the same way', () {
    const source = '''
#version 100
uniform float _impeller_y_flip;
struct FrameInfo
{
    mat4 mvp;
    mediump vec4 fade;
};

uniform FrameInfo frame_info;
attribute vec3 position;
void main() { gl_Position = frame_info.mvp * vec4(position, frame_info.fade.x); }
''';
    final out = transpileGlslEs100To300(source, isFragment: false);
    expect(out, isNot(contains('struct FrameInfo')));
    expect(
      out,
      contains(
        'layout(std140) uniform FrameInfo\n{\n    highp mat4 mvp;\n'
        '    mediump vec4 fade;\n} frame_info;',
      ),
    );
    expect(out, contains('uniform float _impeller_y_flip;'));
    expect(out, contains('frame_info.mvp * vec4(position'));
  });

  test('a struct that is not a uniform is left alone', () {
    const source = 'struct Ray { vec3 at; };\nvoid main() { Ray r; }\n';
    expect(uniformStructsToBlocks(source), source);
  });
}
