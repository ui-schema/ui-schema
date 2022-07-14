import express from 'express'

export interface RequestCustomPayload extends express.Request {
    authId?: any
    trace?: string
}
