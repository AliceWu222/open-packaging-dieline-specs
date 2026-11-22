/**
 * Open B2B Packaging Structural & Supply-Chain Calculators
 * Maintained by Packaging Factory Direct (https://www.packagingfactorydirect.com)
 * Free Interactive Vector SVG/PDF/DXF Tool: https://www.packagingfactorydirect.com/dieline-generator
 */

export function compareRigidBoxFreightCbm({ lengthMm, widthMm, heightMm, quantity, flatThicknessMm = 14 }) {
  const assembledUnitCbm = ((lengthMm + 10) * (widthMm + 10) * (heightMm + 10)) / 1e9;
  const flatLength = lengthMm + 2 * heightMm + 20;
  const flatWidth = 2 * widthMm + 2 * heightMm + 45;
  const flatUnitCbm = (flatLength * flatWidth * flatThicknessMm) / 1e9;

  const cartonOverhead = 1.18;
  const assembledTotalCbm = Number((assembledUnitCbm * quantity * cartonOverhead).toFixed(2));
  const collapsibleTotalCbm = Number((flatUnitCbm * quantity * cartonOverhead).toFixed(2));
  const cbmReductionPercent = Number((((assembledTotalCbm - collapsibleTotalCbm) / assembledTotalCbm) * 100).toFixed(1));

  return {
    quantity,
    assembledTotalCbm,
    collapsibleTotalCbm,
    cbmSaved: Number((assembledTotalCbm - collapsibleTotalCbm).toFixed(2)),
    cbmReductionPercent
  };
}

export function validateGs1DataMatrixZone({ xDimensionMm = 0.38, matrixModules = 26, quietZoneMm = 2.0, varnishKnockout = true }) {
  const symbolSizeMm = Number((xDimensionMm * matrixModules).toFixed(2));
  const minQuietZoneMm = Number((3 * xDimensionMm).toFixed(2));
  const issues = [];
  if (xDimensionMm < 0.254 || xDimensionMm > 0.615) {
    issues.push('X-dimension outside standard healthcare retail/CMO scan window (0.254–0.615 mm).');
  }
  if (quietZoneMm < minQuietZoneMm) {
    issues.push(`Quiet zone (${quietZoneMm} mm) is narrower than 3X minimum (${minQuietZoneMm} mm).`);
  }
  if (!varnishKnockout) {
    issues.push('UV/OPP varnish or lamination must be knocked out in variable-data laser/TIJ coding window.');
  }
  return {
    compliant: issues.length === 0,
    symbolSizeMm,
    recommendedWindowMm: Number((symbolSizeMm + 2 * Math.max(quietZoneMm, minQuietZoneMm) + 4).toFixed(1)),
    issues
  };
}
