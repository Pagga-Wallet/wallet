export function getColorByNumber(id: number): string {
    const colors = [
        "linear-gradient(180deg, #FE6152 0%, #FCEF5D 100%)",
        "linear-gradient(180deg, #F76864 0%, #5B80F6 100%)",
        "linear-gradient(180deg, #6066FE 0%, #52E2FF 100%)",
        "linear-gradient(180deg, #5562FE 0%, #D75EFF 100%)",
        "linear-gradient(180deg, #FCFB5E 0%, #FE5851 100%)",
        "linear-gradient(180deg, #FCFB5E 0%, #FE5851 100%)",
        "linear-gradient(180deg, #58C5F3 0%, #A0FC67 100%)",
        "linear-gradient(180deg, #5B80F6 0%, #F56967 100%)",
        "linear-gradient(180deg, #FED55D 0%, #FF5B52 100%)",
        "linear-gradient(180deg, #BB5DF8 0%, #FC517F 100%)",
        "linear-gradient(180deg, #FF855F 0%, #FF536A 100%)",
        "linear-gradient(180deg, #A0FB67 0%, #54C3F7 100%)",
        "linear-gradient(180deg, #975DFE 0%, #5458FF 100%)",
    ];

    if (Number.isInteger(id) && id >= 0 && id < colors.length) {
        return colors[id];
    }
    return colors[2];
}
