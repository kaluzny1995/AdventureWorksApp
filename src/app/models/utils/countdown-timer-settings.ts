export class CountdownTimerSettings {
    public readonly timeMins: number;
    public readonly notifyGreenAt: number;
    public readonly notifyYellowAt: number;
    public readonly notifyRedAt: number;
    public readonly timeFormat: string;
    public readonly tooltipText: string;
    public readonly tooltipFinishText: string;
    public readonly spinnerDiameter: number;
    public readonly spinnerStrokeWidth: number;
    public readonly titleText: string;
    public readonly titleTextFinish: string;

    constructor(
        timeMins: number,
        notifyGreenAt: number,
        notifyYellowAt: number,
        notifyRedAt: number,
        timeFormat: string,
        tooltipText: string,
        tooltipFinishText: string,
        spinnerDiameter: number,
        spinnerStrokeWidth: number,
        titleText: string,
        titleTextFinish: string
    ) {
        this.timeMins = timeMins;
        this.notifyGreenAt = notifyGreenAt;
        this.notifyYellowAt = notifyYellowAt;
        this.notifyRedAt = notifyRedAt;
        this.timeFormat = timeFormat;
        this.tooltipText = tooltipText;
        this.tooltipFinishText = tooltipFinishText;
        this.spinnerDiameter = spinnerDiameter;
        this.spinnerStrokeWidth = spinnerStrokeWidth;
        this.titleText = titleText;
        this.titleTextFinish = titleTextFinish;
    }
}
