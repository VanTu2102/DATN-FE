import prisma from 'src/actions/db'

export default class Message {
    id: number
    speaker: string
    transcript?: string
    correct_transcript?: string
    start_time?: number
    end_time?: number
    transcriptionId: number
    constructor(id: number,
        speaker: string,
        transcriptionId: number,
        start_time: number,
        end_time: number,
        transcript: string,
        correct_transcript?: string) {
        this.id = id
        this.speaker = speaker
        this.transcript = transcript
        this.correct_transcript = correct_transcript
        this.start_time = start_time
        this.end_time = end_time
        this.transcriptionId = transcriptionId
    }
    updateMessage(id: number) {
        "use server";
        return prisma.message.update({
            where: {
                id: id
            },
            data: {
                speaker: this.speaker,
                transcript: this.transcript,
                correct_transcript: this.correct_transcript,
                start_time: this.start_time,
                end_time: this.end_time,
            }
        })
    }
}