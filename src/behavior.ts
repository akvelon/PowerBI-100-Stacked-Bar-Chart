/*
*  Power BI Visualizations
*
*  Copyright (c) Microsoft Corporation
*  All rights reserved.
*  MIT License
*
*  Permission is hereby granted, free of charge, to any person obtaining a copy
*  of this software and associated documentation files (the ""Software""), to deal
*  in the Software without restriction, including without limitation the rights
*  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
*  copies of the Software, and to permit persons to whom the Software is
*  furnished to do so, subject to the following conditions:
*
*  The above copyright notice and this permission notice shall be included in
*  all copies or substantial portions of the Software.
*
*  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
*  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
*  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
*  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
*  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
*  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
*  THE SOFTWARE.
*/



//utils
import { d3Selection } from "./utils";

// powerbi.visuals
import { interactivityBaseService } from "powerbi-visuals-utils-interactivityutils";
import IInteractiveBehavior = interactivityBaseService.IInteractiveBehavior;
import IInteractivityService = interactivityBaseService.IInteractivityService;
import ISelectionHandler = interactivityBaseService.ISelectionHandler;

//powerbi.api
import powerbiApi from "powerbi-visuals-api";
import IVisualHost = powerbiApi.extensibility.visual.IVisualHost;
import { IBarVisual, VisualDataPoint } from "./visualInterfaces";
import { BaseDataPoint, IBehaviorOptions } from "powerbi-visuals-utils-interactivityutils/lib/interactivityBaseService";

import * as visualUtils from "./utils";
import { Visual } from "./visual";

export interface WebBehaviorOptions extends IBehaviorOptions<BaseDataPoint>{
    bars: d3Selection<any>;
    clearCatcher: d3Selection<any>;
    interactivityService: IInteractivityService<VisualDataPoint>;
    selectionSaveSettings?: any;
    host: IVisualHost;
}

export class WebBehavior implements IInteractiveBehavior {
    private visual: IBarVisual;
    private options: WebBehaviorOptions;
    public selectionHandler: ISelectionHandler;

    constructor(visual: IBarVisual) {
        this.visual = visual;
    }

    public bindEvents(options: WebBehaviorOptions, selectionHandler: ISelectionHandler) {
        this.options = options;
        this.visual.webBehaviorSelectionHandler = selectionHandler;
    }

    public renderSelection(hasSelection: boolean) {
        let hasHighlight = this.visual.getAllDataPoints().filter(x => x.highlight).length > 0;

        let allDatapoints: VisualDataPoint[] = this.visual.getAllDataPoints();
        this.options.interactivityService.applySelectionStateToData(allDatapoints);

        this.options.bars.style({
            "fill-opacity": (p: VisualDataPoint) => visualUtils.getFillOpacity(
                    p.selected,
                    p.highlight,
                    !p.highlight && hasSelection,
                    !p.selected && hasHighlight),
            "stroke": (p: VisualDataPoint)  => {
                if (hasSelection && visualUtils.isSelected(p.selected,
                    p.highlight,
                    !p.highlight && hasSelection,
                    !p.selected && hasHighlight)) {
                        return Visual.DefaultStrokeSelectionColor;
                    }                        

                return p.color;
            },
            "stroke-width": p => {
                if (hasSelection && visualUtils.isSelected(p.selected,
                    p.highlight,
                    !p.highlight && hasSelection,
                    !p.selected && hasHighlight)) {
                    return Visual.DefaultStrokeSelectionWidth;
                }

                return Visual.DefaultStrokeWidth;
            }
        });
    }
}
