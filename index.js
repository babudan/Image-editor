const fileInput = document.querySelector(".resizer__file");
const widthInput = document.querySelector(".resizer-inputwidth");
const heightInput = document.querySelector(".resizer-inputheight");
const aspectToggle = document.querySelector(".resizer__aspect");
const canvas = document.querySelector(".resizer__canvas");
const canvasCtx = canvas.getContext("2d");

let activeImage, originalWidthToHeightRatio;

fileInput.addEventListener("change", (e) => {
  const reader = new FileReader();

  reader.addEventListener("load", () => {
    openImage(reader.result);
  });

  reader.readAsDataURL(e.target.files[0]);
});

widthInput.addEventListener("change", () => {
  if (!activeImage) return;

  const heightValue = aspectToggle.checked
    ? widthInput.value / originalWidthToHeightRatio
    : heightInput.value;

  resize(widthInput.value, heightValue);
});

heightInput.addEventListener("change", () => {
  if (!activeImage) return;

  const widthValue = aspectToggle.checked
    ? heightInput.value * originalWidthToHeightRatio
    : widthInput.value;

  resize(widthValue, heightInput.value);
});

function openImage(imageSrc) {
  activeImage = new Image();

  activeImage.addEventListener("load", () => {
    originalWidthToHeightRatio = activeImage.width / activeImage.height;

    resize(activeImage.width, activeImage.height);
  });

  activeImage.src = imageSrc;
}

function resize(width, height) {
  canvas.width = Math.floor(width);
  canvas.height = Math.floor(height);
  widthInput.value = Math.floor(width);
  heightInput.value = Math.floor(height);

  canvasCtx.drawImage(activeImage, 0, 0, Math.floor(width), Math.floor(height));
  const original = canvasCtx.getImageData(0, 0, Math.floor(width), Math.floor(height))
  console.log(original)
// }



let ORIGINAL_IMAGE_DATA

const cacheImageData = () => {
  const original = canvasCtx.getImageData(0, 0, Math.floor(width), Math.floor(height)).data
  ORIGINAL_IMAGE_DATA = new Uint8ClampedArray(original.length)
  for (let i = 0; i < original.length; i += 1) {
    ORIGINAL_IMAGE_DATA[i] = original[i]
  }
  
  const resetButton = document.querySelector('input[value="Reset"]')

  resetButton.addEventListener('click', () => {
    const imgData = canvasCtx.getImageData(0, 0, Math.floor(width), Math.floor(height))
    for (let i = 0; i < imgData.data.length; i += 1) {
      imgData.data[i] = ORIGINAL_IMAGE_DATA[i]
    }
    canvasCtx.putImageData(imgData, 0, 0)
  })
}

const drawImage = img => {
  canvas.height = img.height
  canvas.width = img.width
  context.drawImage(img, 0, 0, img.width, img.height)
  cacheImageData()
}
const loadImage = e => {
  const img = new Image()
  img.src = e.target.result
  img.addEventListener('load', () => {
      drawImage(img)
  })
}
const detectImageInput = e => {
  const file = e.target.files[0]
      , fr = new FileReader()
  if (!file.type.includes("image")) return
  fr.addEventListener('load', loadImage)
  fr.readAsDataURL(file)
}
fileInput.addEventListener('change', detectImageInput)

const grayButton = document.querySelector('input[value="Grayscale"]')

grayButton.addEventListener('click', () => {
  const imgData = canvasCtx.getImageData(0, 0, Math.floor(width), Math.floor(height))
  for (let i = 0; i < imgData.data.length; i += 4) {
    const r = imgData.data[i]
      , g = imgData.data[i+1]
      , b = imgData.data[i+2]
      , avg = Math.round((r + g + b) / 3)
    imgData.data[i] = imgData.data[i+1] = imgData.data[i+2] = avg
  }
  canvasCtx.putImageData(imgData, 0, 0)
})

const redButton = document.querySelector('input[value="Red"]')

redButton.addEventListener('click', () => {
  const imgData = canvasCtx.getImageData(0, 0, Math.floor(width), Math.floor(height))
  for (let i = 0; i < imgData.data.length; i += 4) {
    imgData.data[i] = 255
  }
  canvasCtx.putImageData(imgData, 0, 0)
})

}