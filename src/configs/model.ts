interface IConfig {
    timestamps: boolean;
    versionKey: boolean;
    // id: boolean;
    // toJSON: Object;
}

export const configSchema: IConfig = {
    timestamps: true,
    versionKey: false,
    // id: true,
    // toJSON: {
    //   transform(_doc: any, ret: { _id?: string; id: string }) {
    //     ret.id = ret._id || "";
    //     delete ret._id;
    //   },
    // },
};
