import mongoose, { Document } from 'mongoose'

interface TicketAttrs {
    title: string
    price: number
    userId: string
}

interface TicketDoc extends Document {
    title: string
    price: number
    userId: string
}

interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attrs: TicketAttrs): TicketDoc
}

const schema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    userId: {
        type: String,
        required: true
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id
            delete ret._id
        },
        versionKey: false
    }
})

schema.statics.build = (attrs: TicketAttrs): TicketDoc => new Ticket(attrs)

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', schema)

export { Ticket }