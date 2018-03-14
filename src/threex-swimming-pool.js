var THREEx = THREEx || {}

THREEx.SwimmingPool = function(width, length, depth, water){
	
	var poolCenter = new THREE.Group
	poolCenter.rotateX(-Math.PI/2);
	this.object3d = poolCenter


	var waterGeometry = new THREE.PlaneGeometry(width, length, 10*width, 10*length);
    waterGeometry.mergeVertices();
    this.waves = [];
    for (let v, i = 0, l = waterGeometry.vertices.length; i < l; i++) {
      v = waterGeometry.vertices[i];
      this.waves.push({
        z: v.z,
        ang: Math.random() * Math.PI * 2,
        amp: 0.01 + Math.random() * 0.03,
        speed: (1 + Math.random() * 2) / 1000 // radians / frame
      });
    }

	material = new THREE.MeshPhongMaterial({
        color: water.color,
        transparent: water.opacity < 1,
        opacity: water.opacity,
		shading: THREE.FlatShading,
		side: THREE.DoubleSide,
	});

	this.waterMesh = new THREE.Mesh(waterGeometry, material);
	this.waterMesh.position.z = depth * (water.level - 1);

	this.innerWaterGeometry = new THREE.Mesh(waterGeometry, material);
	this.innerWaterGeometry.position.z = depth * (water.level - 1);
	//////////////////////////////////////////////////////////////////////////////
	//		build mesh
	//////////////////////////////////////////////////////////////////////////////

	var insideMesh = this._buildInsideMesh(width, length, depth)
	poolCenter.add(insideMesh)
	this.insideMesh = insideMesh

	// create outsideMesh which is visible IIF outside the portal
	var outsideMesh = this._buildOutsideMesh(width, length, depth)
	poolCenter.add(outsideMesh)
	this.outsideMesh = outsideMesh

	// create frameMesh for the frame of the portal
	var frameMesh = this._buildRectangularFrame(width/100, width, length)
	poolCenter.add(frameMesh)

}
//////////////////////////////////////////////////////////////////////////////
//		Code Separator
//////////////////////////////////////////////////////////////////////////////
THREEx.SwimmingPool.buildTransparentMaterial = function(){
	// if there is a cached version, return it
	if(THREEx.SwimmingPool.buildTransparentMaterial.material){
		return THREEx.SwimmingPool.buildTransparentMaterial.material
	}
	var material = new THREE.MeshBasicMaterial({
		colorWrite: false // only write to z-buf
	})
	
	// cache the material
	THREEx.SwimmingPool.buildTransparentMaterial.material = material
	
	return material		
}

//////////////////////////////////////////////////////////////////////////////
//		Build various cache
//////////////////////////////////////////////////////////////////////////////
THREEx.SwimmingPool.buildSquareCache = function(){
	var container = new THREE.Group
	// add outter cube - invisibility cloak
	var geometry = new THREE.PlaneGeometry(50,50);
	var material = THREEx.SwimmingPool.buildTransparentMaterial()

	var mesh = new THREE.Mesh(geometry, material);
	mesh.position.x =  geometry.parameters.width/2 + 0.5
	mesh.position.y = -geometry.parameters.height/2 + 0.5
	container.add(mesh)
	
	var mesh = new THREE.Mesh(geometry, material);
	mesh.position.x = -geometry.parameters.width/2 + 0.5
	mesh.position.y = -geometry.parameters.height/2 - 0.5
	container.add(mesh)
	
	var mesh = new THREE.Mesh(geometry, material);
	mesh.position.x = -geometry.parameters.width/2 - 0.5
	mesh.position.y =  geometry.parameters.height/2 - 0.5
	container.add(mesh)
	
	var mesh = new THREE.Mesh(geometry, material);
	mesh.position.x = +geometry.parameters.width/2 - 0.5
	mesh.position.y =  geometry.parameters.height/2 + 0.5
	container.add(mesh)

	return container
}

//////////////////////////////////////////////////////////////////////////////
//		build meshes
//////////////////////////////////////////////////////////////////////////////

/**
 * create insideMesh which is visible IIF inside the portal
 */
THREEx.SwimmingPool.prototype._buildInsideMesh	= function(width, length, depth){
	var scene = new THREE.Group

	var geometry = new THREE.PlaneGeometry(width, length)
	var material = THREEx.SwimmingPool.buildTransparentMaterial()
	var mesh = new THREE.Mesh(geometry, material)
	mesh.rotation.y = Math.PI
	scene.add(mesh)


	//////////////////////////////////////////////////////////////////////////////
	//		add inner pyramid
	/////////////////////////////////////////////////////////////////////////////

	var geometry = new THREE.Geometry();

	geometry.vertices = [
		new THREE.Vector3(0, 0, 0),
		new THREE.Vector3(0, 1, 0),
		new THREE.Vector3(1, 1, 0),
		new THREE.Vector3(1, 0, 0),
		new THREE.Vector3(0.5, 0.5, 1)
	];
	
	geometry.faces = [
		new THREE.Face3(0, 1, 2),
		new THREE.Face3(0, 2, 3),
		new THREE.Face3(1, 0, 4),
		new THREE.Face3(2, 1, 4),
		new THREE.Face3(3, 2, 4),
		new THREE.Face3(0, 3, 4)
	];

	//Add UV to draw the material
	for(let i=0; i< geometry.faces.length; i++){
		geometry.faceVertexUvs[0].push([
			new THREE.Vector2(0,0),
			new THREE.Vector2(0,-1),
			new THREE.Vector2(-1,0),
			new THREE.Vector2(-1,-1),
		]);
	}
	
	geometry.uvsNeedUpdate = true;

	var material = new THREE.MeshBasicMaterial({
        color: 'white',
		side: THREE.DoubleSide,
	});
	var innerPoolMesh = new THREE.Mesh(geometry, material);
	
	var textureLoader = new THREE.TextureLoader();
	textureLoader.load('images/pool.jpg', function(map) {
		map.wrapS = THREE.RepeatWrapping;
		map.wrapT = THREE.RepeatWrapping;
		map.anisotropy = 16;
		map.repeat.set(10, 10);
		material.map = map;
		material.needsUpdate = true;
	});

	var coef = 30;
	var newWidth = width * coef,
		newLength = length * coef,
		newHeight = 30;

	innerPoolMesh.position.z = - newHeight * (coef - 1) / coef;
	innerPoolMesh.scale.x = newWidth;
	innerPoolMesh.scale.y = newLength;
	innerPoolMesh.scale.z = newHeight;
	innerPoolMesh.position.x = - newWidth / 2;
	innerPoolMesh.position.y = - newLength / 2;
	
	scene.add(innerPoolMesh)
	scene.add(this.innerWaterGeometry)
	
	return scene
}

/**
 * create outsideMesh which is visible IIF outside the portal
 */
THREEx.SwimmingPool.prototype._buildOutsideMesh = function(width, length, depth){
	var scene = new THREE.Group

	//////////////////////////////////////////////////////////////////////////////
	//		add squareCache
	//////////////////////////////////////////////////////////////////////////////
	var squareCache = THREEx.SwimmingPool.buildSquareCache()
	squareCache.scale.x = width
	squareCache.scale.y = length
	scene.add(squareCache)

	var back = new THREE.PlaneGeometry(width, length, 1);
	var backMaterial = new THREE.MeshStandardMaterial({side: THREE.DoubleSide})
	var backMesh = new THREE.Mesh(back, backMaterial);
	backMesh.position.z = -depth
	scene.add(backMesh)        
	var textureLoader = new THREE.TextureLoader();

	textureLoader.load('images/pool.jpg', function(map) {
	    map.wrapS = THREE.RepeatWrapping;
	    map.wrapT = THREE.RepeatWrapping;
	    map.anisotropy = 16;
	    map.repeat.set(1, 1);
	    backMaterial.map = map;
	    backMaterial.needsUpdate = true;
	});

	var buildWall = function(width, height, material){
		var wall = new THREE.PlaneGeometry(width, height, 1);
		var wallMaterial = new THREE.MeshStandardMaterial({side: THREE.DoubleSide});
		var mesh = new THREE.Mesh(wall, wallMaterial);
		mesh.position.z = - height / 2
		mesh.rotation.x = Math.PI / 2;

		textureLoader.load('images/pool.jpg', function(map) {
			map.wrapS = THREE.RepeatWrapping;
			map.wrapT = THREE.RepeatWrapping;
			map.anisotropy = 16;
			map.repeat.set(1, 1);
			wallMaterial.map = map;
			wallMaterial.needsUpdate = true;
		});

		return mesh
	}
	
	// Add top wall
	var topWall = buildWall(width, depth);
	topWall.position.y = length / 2
	scene.add(topWall)

	// Add bottom wall
	var bottomWall = buildWall(width, depth);
	bottomWall.position.y = - length / 2
	scene.add(bottomWall)

	// Add left wall
	var leftWall = buildWall(length, depth);
	leftWall.rotateY(Math.PI/2)
	leftWall.position.x = width / 2
	scene.add(leftWall)

	// Add right wall
	var rightWall = buildWall(length, depth);
	rightWall.rotateY(Math.PI/2)
	rightWall.position.x = - width / 2
	scene.add(rightWall)

	scene.add(this.waterMesh)

	return scene
}

/**
 * create frameMesh for the frame of the portal
 */
THREEx.SwimmingPool.prototype._buildRectangularFrame = function(radius, width, height){
	var container = new THREE.Group
	var material = new THREE.MeshNormalMaterial()
	var material = new THREE.MeshPhongMaterial({
		color: 'silver',
		emissive: 'green'
	})

	var geometryBeamVertical = new THREE.CylinderGeometry(radius, radius, height - radius)

	// mesh right
	var meshRight = new THREE.Mesh(geometryBeamVertical, material)
	meshRight.position.x = width/2
	container.add(meshRight)

	// mesh right
	var meshLeft = new THREE.Mesh(geometryBeamVertical, material)
	meshLeft.position.x = -width/2
	container.add(meshLeft)

	var geometryBeamHorizontal = new THREE.CylinderGeometry(radius, radius, width - radius).rotateZ(Math.PI/2)

	// mesh top
	var meshTop = new THREE.Mesh(geometryBeamHorizontal, material)
	meshTop.position.y = height/2
	container.add(meshTop)

	// mesh bottom
	var meshBottom = new THREE.Mesh(geometryBeamHorizontal, material)
	meshBottom.position.y = -height/2
	container.add(meshBottom)

	return container
}	

//////////////////////////////////////////////////////////////////////////////
//		update function
//////////////////////////////////////////////////////////////////////////////

THREEx.SwimmingPool.prototype.update = function (t, dt) {
	// determine if the user is isOutsidePortal
	var localPosition = new THREE.Vector3
	this.object3d.worldToLocal(localPosition)
	var isOutsidePortal = localPosition.z >= 0 ? true : false

	// handle mesh visibility based on isOutsidePortal
	if(isOutsidePortal){
		this.outsideMesh.visible = true
		this.insideMesh.visible = false
	}else{
		this.outsideMesh.visible = false
		this.insideMesh.visible = true
	}

	if (!dt) return;
	const verts = this.waterMesh.geometry.vertices;
    for (let v, vprops, i = 0; (v = verts[i]); i++){
      vprops = this.waves[i];
      v.z = vprops.z + Math.sin(vprops.ang) * vprops.amp;
      vprops.ang += vprops.speed * dt;
    }
	this.waterMesh.geometry.verticesNeedUpdate = true;
}
