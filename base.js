tileSources = tileSources.map(function(tileSource, i) {
    return {
      tileSource: tileSource,
      opacity: i === 0 ? 1 : 0,
      preload: i === 1 ? true : false
    };
  });
             
  var viewer = OpenSeadragon({
    id: 'seadragon-viewer',
    prefixUrl: 'http://cdn.jsdelivr.net/npm/openseadragon@2.3/build/openseadragon/images/',
    tileSources: tileSources,
    maxZoomPixelRatio: 128,
    imageSmoothingEnabled: true,
    showNavigator: true,
    maxImageCacheCount: 4096
  });
  
  var index = 0;
  var oldIndex = 0;
  document.getElementById("image_number").innerHTML = "Image " + (index+1).toString() + "/" + tileSources.length.toString(); 
  

  document.onkeydown = checkKey;
  viewer.innerTracker.keyDownHandler = null;
    viewer.innerTracker.keyPressHandler = null;

  function changeImage(oldIndex, index){
    var oldTiledImage = viewer.world.getItemAt(oldIndex);
    
    // index = (index + 1) % tileSources.length;
    var nextIndex = (index + 1) % tileSources.length;
    
    var newTiledImage = viewer.world.getItemAt(index);
    var nextTiledImage = viewer.world.getItemAt(nextIndex);
    
    oldTiledImage.setOpacity(0);
    newTiledImage.setOpacity(1);
    nextTiledImage.setPreload(true);
    document.getElementById("image_number").innerHTML = "Image " + (index+1).toString() + "/" + tileSources.length.toString(); 
  }

  function prevImage() {
  	oldIndex = index;
	  index = index - 1;
	  if (index < 0) {
		  index= tileSources.length - 1;
	  }
	  changeImage(oldIndex, index);
    }

  function nextImage() {
	  oldIndex = index;
	  index = (index + 1) % tileSources.length;
	  changeImage(oldIndex, index);
    }

  function checkKey(e) {
    e = e || window.event;
    if (e.keyCode == '37') {
  	  prevImage();
    }
    else if (e.keyCode == '39') {
  	 nextImage();
    }
  }
  
