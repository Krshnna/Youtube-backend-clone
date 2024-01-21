import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";


const videoSchema = new mongoose.Schema({
    title: {
        type:String,
        required: true,
    },
    videoFile: {
        public_id: {
            type: String, 
            required: true,
        },
        url: {
            type: String,
            required: true,
        }
    },
    thumbnail: {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        }
    },
    description: {
        type: String, 
        required: true,
    },
    duration: {
        type: Number,
        required:true,
    },
    views: {
        type: Number, 
        default: 0,
        required: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    isPublished: {
        type: Boolean,
        default: false
    },
    refreshToken: {
        type: String,
    }
},{timestamps: true});
videoSchema.plugin(mongooseAggregatePaginate);

export const Video = mongoose.model("Video", videoSchema);