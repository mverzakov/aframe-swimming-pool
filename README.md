# AR.js swimming pool component

Swimming pool component for [AR.js](https://github.com/jeromeetienne/AR.js).
Based on the [A-Frame](https://aframe.io/) and [three.js](https://threejs.org/).

# Usage

```html
<!doctype HTML>
<html>
<head>
    <meta charset="utf-8"/>
    <script src="https://cdn.rawgit.com/jeromeetienne/AR.js/1.5.0/aframe/examples/vendor/aframe/build/aframe.min.js"></script>
    <script src="https://cdn.rawgit.com/jeromeetienne/AR.js/1.5.0/aframe/build/aframe-ar.js"></script>
    <script>ARjs.Context.baseURL = 'lib/three.js/'</script>
    <!-- include aframe-swimming-pool -->
    <script src='src/aframe-swimming-pool.js'></script>
    <script src='src/threex-swimming-pool.js'></script>
</head>
<!-- Define your 3d scene and enabled ar.js -->
	<a-scene embedded arjs='trackingMethod: best;'>
		<!-- Create a anchor to attach your augmented reality -->
		<a-anchor >
            <!-- Add swimming pool -->
			<a-swimming-pool></a-swimming-pool>
		</a-anchor>
		<!-- Define a static camera -->
        <a-camera-static/>
	</a-scene>
</body>
</html>
```

# Possible options

|         Attribute         |       Description        |       Default value        |
|---------------------------|--------------------------|----------------------------|
| width                     | Width of the Pool        | 1                          |
| length                    | Length of the Pool       | 1                          |
| depth                     | Depth of the Pool        | 1                          |
| position                  | Position of the Pool     | '0 0 0'                    |
| rotation                  | Rotation of the Pool     | '0 0 0'                    |
| water-level               | Water level (0 to 1)     | 0.95                       |
| water-opacity             | Water Opacity (0 to 1)   | 0.8                        |
| water-color               | Water Color              | #7AD2F7                    |

# Examples

**Usual Swimming Pool 2 x 4**
[Regular swimming pool](https://mverzakov.github.io/aframe-swimming-pool/basic.html)
![Swimming Pool Outside](/examples/swimming-pool-outside.gif)

**90° Rotated Swimming Pool**
[Here](https://mverzakov.github.io/aframe-swimming-pool/basic.90.html) you can get inside the pool.

![Swimming Pool Going Inside](/examples/swimming-pool-going-inside.gif)

**180° Rotated Swimming Pool**
[Here](https://mverzakov.github.io/aframe-swimming-pool/basic.180.html) you are inside the pool.

![Swimming Pool Going Inside](/examples/swimming-pool-inside.gif)
