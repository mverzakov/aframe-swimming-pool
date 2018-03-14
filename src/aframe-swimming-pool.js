//////////////////////////////////////////////////////////////////////////////
//		arjs-hit-testing
//////////////////////////////////////////////////////////////////////////////
AFRAME.registerComponent('arjs-swimming-pool', {
	schema: {
		width: {	// width of the pool
			type: 'number',
			default: 1,
		},
		length: {	// length of the pool
			type: 'number',
			default: 1,
		},
		depth: {	// depth of the pool
			type: 'number',
			default: 1,
		},
		waterLevel: {	// amount of water in the pool
			type: 'number',
			default: 0.95,
		},
		waterColor: {
			type: 'color',
			default: '#7AD2F7'
		},
		wavesDensity: {
			default: 10,
		},
		waterOpacity: {
			default: 0.8
		}
	},
	play: function () {
		var _this = this

		var width = this.data.width
		var length = this.data.length
		var depth = this.data.depth
		var water = {
			level: this.data.waterLevel,
			color: this.data.waterColor,
			opacity: this.data.waterOpacity
		}
		
		var pool = new THREEx.SwimmingPool(width, length, depth, water)
		this._pool = pool

		this.el.object3D.add(pool.object3d)
	},
	tick: function(t, dt){
		this._pool.update(t, dt)
	}
})


AFRAME.registerPrimitive('a-swimming-pool', AFRAME.utils.extendDeep({}, AFRAME.primitives.getMeshMixin(), {
	defaultComponents: {
		'arjs-swimming-pool': {},
	},
	mappings: {
		'width': 'arjs-swimming-pool.width',
		'length': 'arjs-swimming-pool.length',
		'depth': 'arjs-swimming-pool.depth',
		'water-level': 'arjs-swimming-pool.waterLevel',
		'water-color': 'arjs-swimming-pool.waterColor',
		'water-opacity': 'arjs-swimming-pool.waterOpacity',
	}
}))
