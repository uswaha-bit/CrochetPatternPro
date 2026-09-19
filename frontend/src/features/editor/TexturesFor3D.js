import * as THREE from "three";

const stitchPaths = {
  ch: "/ch.svg",
  slip: "/slst.svg",
  sc: "/sc.svg",
  dc: "/dc.svg",
  hdc: "/hdc.svg",
  tr: "/tr.svg",
  mr: "/mr.svg",
};

// Preload textures once and export
const loader = new THREE.TextureLoader();
const textures = {};

Object.entries(stitchPaths).forEach(([name, path]) => {
  textures[name] = loader.load(path);
});

export default textures;
