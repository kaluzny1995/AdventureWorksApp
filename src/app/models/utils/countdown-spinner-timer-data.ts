export class CountdownSpinnerTimerData {
    public readonly currentTimeSecs: number;
    public readonly totalTimeSecs: number;
    public readonly timeFormat: string;
    public readonly notifications: number[];
    public readonly spinnerDiameter: number;
    public readonly spinnerStrokeWidth: number;
    public readonly titleText: string;
    public readonly titleTextFinish: string;

    constructor(
        currentTimeSecs: number,
        totalTimeSecs: number,
        timeFormat: string,
        notifications: number[],
        spinnerDiameter: number,
        spinnerStrokeWidth: number,
        titleText: string,
        titleTextFinish: string
    ) {
        this.currentTimeSecs = currentTimeSecs;
        this.totalTimeSecs = totalTimeSecs;
        this.timeFormat = timeFormat;
        this.notifications = notifications;
        this.spinnerDiameter = spinnerDiameter;
        this.spinnerStrokeWidth = spinnerStrokeWidth;
        this.titleText = titleText;
        this.titleTextFinish = titleTextFinish;
    }
}
