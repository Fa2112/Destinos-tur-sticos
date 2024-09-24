import { LoadingManager, TextureLoader  } from "three";
import * as images from "@images/images"

function loader() {
    const loadingManager = new LoadingManager();
    const textureLoader = new TextureLoader(loadingManager);

    const progress = document.getElementById("progress");

    const loading = document.querySelector(".loading")


    loadingManager.onProgress = function (url, loaded, total) {
        progress.value = (loaded / total) * 100;
    }

    loadingManager.onLoad = function () {
        loading.classList.add("faded");
        progress.classList.add("faded");
    }


    return photos = [
        {
            title: "Cataratas de Iguazú",
            description: "lorem ipsum",
            photo: textureLoader.load(images.img1),
            link: 'https://iguazuargentina.com',
        },
        {
            title: "Ruinas de San Ignacio Mini",
            description: "lorem ipsum",
            photo: textureLoader.load(images.img2),
            link: 'https://www.iguazuturismo.com.ar/que-hacer/ruinas-san-ignacio.html'
        },
        {
            title: "Glaciar Perito Moreno",
            description: "lorem ipsum",
            photo: textureLoader.load(images.img3),
            link: 'https://www.elcalafate.tur.ar/en-glaciar-perito-moreno.htm'
        },
        {
            title: "Quebrada de Humahuaca",
            description: "lorem ipsum",
            photo: textureLoader.load(images.img4),
            link: 'https://www.quebradadehumahuaca.com/info-gral/'
        },
    ];

}

export default loader;