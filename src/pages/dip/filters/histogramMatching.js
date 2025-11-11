/**
 * Histogram Matching - matches histogram of source image to target image
 * @param {string} sourceImageSrc - Source image data URL
 * @param {string} targetImageSrc - Target image data URL
 * @returns {Promise<{matchedImage: string, sourceHist: number[], targetHist: number[], matchedHist: number[], mapping: number[]}>}
 */
export function applyHistogramMatching(sourceImageSrc, targetImageSrc) {
  return new Promise((resolve) => {
    const sourceImg = new Image();
    const targetImg = new Image();
    
    let sourceLoaded = false;
    let targetLoaded = false;

    const processImages = () => {
      if (!sourceLoaded || !targetLoaded) return;

      // Process source image
      const sourceCanvas = document.createElement("canvas");
      const sourceCtx = sourceCanvas.getContext("2d");
      sourceCanvas.width = sourceImg.width;
      sourceCanvas.height = sourceImg.height;
      sourceCtx.drawImage(sourceImg, 0, 0);

      const sourceImgData = sourceCtx.getImageData(0, 0, sourceCanvas.width, sourceCanvas.height);
      const sourceData = sourceImgData.data;

      // Process target image
      const targetCanvas = document.createElement("canvas");
      const targetCtx = targetCanvas.getContext("2d");
      targetCanvas.width = targetImg.width;
      targetCanvas.height = targetImg.height;
      targetCtx.drawImage(targetImg, 0, 0);

      const targetImgData = targetCtx.getImageData(0, 0, targetCanvas.width, targetCanvas.height);
      const targetData = targetImgData.data;

      // Calculate histograms for each RGB channel separately
      const sourceHistR = new Array(256).fill(0);
      const sourceHistG = new Array(256).fill(0);
      const sourceHistB = new Array(256).fill(0);
      const sourceHistGray = new Array(256).fill(0);
      
      const targetHistR = new Array(256).fill(0);
      const targetHistG = new Array(256).fill(0);
      const targetHistB = new Array(256).fill(0);
      const targetHistGray = new Array(256).fill(0);
      
      // Calculate histograms for source image
      for (let i = 0; i < sourceData.length; i += 4) {
        sourceHistR[sourceData[i]]++;
        sourceHistG[sourceData[i + 1]]++;
        sourceHistB[sourceData[i + 2]]++;
        const gray = Math.round(0.3 * sourceData[i] + 0.59 * sourceData[i + 1] + 0.11 * sourceData[i + 2]);
        sourceHistGray[gray]++;
      }

      // Calculate histograms for target image
      for (let i = 0; i < targetData.length; i += 4) {
        targetHistR[targetData[i]]++;
        targetHistG[targetData[i + 1]]++;
        targetHistB[targetData[i + 2]]++;
        const gray = Math.round(0.3 * targetData[i] + 0.59 * targetData[i + 1] + 0.11 * targetData[i + 2]);
        targetHistGray[gray]++;
      }

      // Helper function to create mapping from histograms
      const createMapping = (sourceHist, targetHist, totalSource, totalTarget) => {
        // Calculate CDFs
        const sourceCDF = new Array(256);
        const targetCDF = new Array(256);
        
        sourceCDF[0] = sourceHist[0];
        targetCDF[0] = targetHist[0];
        
        for (let i = 1; i < 256; i++) {
          sourceCDF[i] = sourceCDF[i - 1] + sourceHist[i];
          targetCDF[i] = targetCDF[i - 1] + targetHist[i];
        }

        // Normalize CDFs to [0, 1]
        const sourceCDFNorm = sourceCDF.map(v => v / totalSource);
        const targetCDFNorm = targetCDF.map(v => v / totalTarget);

        // Create mapping
        const mapping = new Array(256);
        for (let s = 0; s < 256; s++) {
          const sourceCDFVal = sourceCDFNorm[s];
          let minDiff = Infinity;
          let bestMatch = 0;
          
          for (let t = 0; t < 256; t++) {
            const diff = Math.abs(targetCDFNorm[t] - sourceCDFVal);
            if (diff < minDiff) {
              minDiff = diff;
              bestMatch = t;
            }
          }
          mapping[s] = bestMatch;
        }
        
        return { mapping, sourceCDFNorm, targetCDFNorm };
      };

      const sourceTotal = sourceData.length / 4;
      const targetTotal = targetData.length / 4;

      // Create mappings for each channel
      const mappingR = createMapping(sourceHistR, targetHistR, sourceTotal, targetTotal);
      const mappingG = createMapping(sourceHistG, targetHistG, sourceTotal, targetTotal);
      const mappingB = createMapping(sourceHistB, targetHistB, sourceTotal, targetTotal);
      const mappingGray = createMapping(sourceHistGray, targetHistGray, sourceTotal, targetTotal);

      // Apply mappings to each RGB channel separately
      const matchedData = new Uint8ClampedArray(sourceData);
      const matchedHistR = new Array(256).fill(0);
      const matchedHistG = new Array(256).fill(0);
      const matchedHistB = new Array(256).fill(0);
      const matchedHistGray = new Array(256).fill(0);
      
      for (let i = 0; i < sourceData.length; i += 4) {
        // Apply channel-specific mappings
        matchedData[i] = mappingR.mapping[sourceData[i]];     // R
        matchedData[i + 1] = mappingG.mapping[sourceData[i + 1]]; // G
        matchedData[i + 2] = mappingB.mapping[sourceData[i + 2]]; // B
        matchedData[i + 3] = sourceData[i + 3]; // Keep alpha
        
        // Calculate histograms of matched image
        matchedHistR[matchedData[i]]++;
        matchedHistG[matchedData[i + 1]]++;
        matchedHistB[matchedData[i + 2]]++;
        const gray = Math.round(0.3 * matchedData[i] + 0.59 * matchedData[i + 1] + 0.11 * matchedData[i + 2]);
        matchedHistGray[gray]++;
      }

      // Create output image
      const matchedImgData = new ImageData(matchedData, sourceCanvas.width, sourceCanvas.height);
      sourceCtx.putImageData(matchedImgData, 0, 0);

      resolve({
        matchedImage: sourceCanvas.toDataURL(),
        sourceHist: sourceHistGray,
        targetHist: targetHistGray,
        matchedHist: matchedHistGray,
        mapping: mappingGray.mapping,
        sourceCDF: mappingGray.sourceCDFNorm,
        targetCDF: mappingGray.targetCDFNorm
      });
    };

    sourceImg.onload = () => {
      sourceLoaded = true;
      processImages();
    };

    targetImg.onload = () => {
      targetLoaded = true;
      processImages();
    };

    sourceImg.src = sourceImageSrc;
    targetImg.src = targetImageSrc;
  });
}

