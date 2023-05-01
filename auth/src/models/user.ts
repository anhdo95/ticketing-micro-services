import mongoose, { Document } from 'mongoose'
import Password from '../services/password'

interface UserAttrs {
    email: string,
    password: string
}

interface UserDoc extends Document {
    email: string,
    password: string
}

interface UserModel extends mongoose.Model<UserDoc> {
    build(attrs: UserAttrs): UserDoc
}

const schema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id
            delete ret._id
            delete ret.password
        },
        versionKey: false
    }
})

schema.pre('save', async function(done) {
    if (this.isModified('password')) {
        this.set('password', await Password.toHash(this.get('password')))
    }
    done()
})

schema.statics.build = (attrs: UserAttrs): UserDoc => new User(attrs)

const User = mongoose.model<UserDoc, UserModel>('User', schema)

export { User }