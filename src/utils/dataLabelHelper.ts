module powerbi.extensibility.visual {
    export class DataLabelHelper {
        public static labelBackgroundWidthPadding = 17.2;
        public static labelBackgroundHeightPadding = 8;
        public static labelBackgroundXShift = 7.5;
        public static labelBackgroundYShift = 3;
        private static dataLabelMargin: number = 8;

        public static canOverflow(settings: categoryLabelsSettings): boolean {
            if (settings.labelPosition === LabelPosition.InsideCenter) {
                return false;
            } else if (settings.labelPosition === LabelPosition.Auto) {
                return true;
            } else if (settings.overflowText) {
                return true;
            }

            return false;
        }

        private static calculateShiftForLegend(shift: number,
                                                labelWidth: number,
                                                barCoordinates: Coordinates,
                                                settings: categoryLabelsSettings) {

            let barX: number = barCoordinates.x,
                barWidth: number = barCoordinates.width,
                backGroundShift: number = settings.showBackground ? DataLabelHelper.labelBackgroundXShift : 0,
                labelRightBorderPosition: number = shift + labelWidth + backGroundShift;

            const gap: number = 6;

            if (labelRightBorderPosition + gap > barX + barWidth) {
                shift = barX + barWidth - labelWidth - backGroundShift - gap;
                labelRightBorderPosition = shift + labelWidth + backGroundShift;

                if (labelRightBorderPosition + gap < barX) {
                    return null;
                }
            }

            if (shift - backGroundShift < barX) {
                shift = barX + backGroundShift;
                labelRightBorderPosition = shift + labelWidth + backGroundShift;

                if (labelRightBorderPosition + gap > barX + barWidth) {
                    return null;
                }
            }

            return shift;
        }

        private static calculateShiftForNoLegend(shift: number,
                                                labelWidth: number,
                                                chartWidth: number,
                                                barCoordinates: Coordinates,
                                                settings: categoryLabelsSettings) {

            let barWidth: number = barCoordinates.width,
                backGroundShift: number = settings.showBackground ? DataLabelHelper.labelBackgroundXShift : 0,
                labelLeftBorderPosition: number = shift - backGroundShift,
                labelRightBorderPosition: number = shift + labelWidth + backGroundShift;

            const gap: number = 6;

            let canOverflow: boolean = DataLabelHelper.canOverflow(settings);

            let maxPossibleRightPosition: number = canOverflow ? chartWidth : barWidth - gap;

            if (labelLeftBorderPosition < 1) {
                shift = 1 + backGroundShift;

                if (shift + labelWidth + gap > maxPossibleRightPosition) {
                    return null;
                }

            } else if (labelRightBorderPosition + gap > maxPossibleRightPosition) {
                shift = maxPossibleRightPosition - labelWidth - backGroundShift;

                if (shift - backGroundShift < 1) {
                    return null;
                }
            }

            return shift;
        }

        public static calculatePositionShift(settings: categoryLabelsSettings,
                                            labelWidth: number,
                                            dataPoint: VisualDataPoint,
                                            chartWidth: number,
                                            isLegendRendered: boolean): number {

            let barCoordinates: Coordinates = dataPoint.barCoordinates; 

            let shift: number = dataPoint.value >= 0 ? 
                                    this.calculateLabelPositionShift(settings, labelWidth, barCoordinates) : 
                                    this.calculateLabelPositionShiftForNegativeValues(settings, labelWidth, barCoordinates);

            if (isLegendRendered) {
                return this.calculateShiftForLegend(shift, labelWidth, barCoordinates, settings);
            } else {
                return this.calculateShiftForNoLegend(shift, labelWidth, chartWidth, barCoordinates, settings);
            }
        }

        private static calculateLabelPositionShift(settings: categoryLabelsSettings,
            labelWidth: number,
            barCoordinates: Coordinates): number {

            const backgroundMargin: number = settings.showBackground ? 6 : 0;

            let barX: number = barCoordinates.x,
                barWidth: number = barCoordinates.width;

            switch (settings.labelPosition) {
                case LabelPosition.InsideEnd: {
                    return barX + barWidth - this.dataLabelMargin - labelWidth - backgroundMargin;
                }
                case LabelPosition.InsideBase: {
                    return barX + this.dataLabelMargin + backgroundMargin;
                }
                default: {
                    return barX + barWidth / 2 - labelWidth / 2;
                }
            }
        }

        private static calculateLabelPositionShiftForNegativeValues(settings: categoryLabelsSettings,
            labelWidth: number,
            barCoordinates: Coordinates): number {

            const backgroundMargin: number = settings.showBackground ? 6 : 0;

            let barX: number = barCoordinates.x,
                barWidth: number = barCoordinates.width;

            switch (settings.labelPosition) {
                case LabelPosition.InsideEnd: {
                    return barX + this.dataLabelMargin + backgroundMargin;
                }
                case LabelPosition.InsideBase: {
                    return barX + barWidth - this.dataLabelMargin - backgroundMargin - labelWidth;
                }
                default: {
                    return barX + barWidth / 2 - labelWidth / 2;
                }
            }
        }
    }
}