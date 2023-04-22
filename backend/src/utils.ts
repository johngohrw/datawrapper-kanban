import { Prisma } from "@prisma/client"

export const getGeneralizedPrismaErrorMessage = (error: any) => {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        return error.message
    }
    if (error instanceof Prisma.PrismaClientUnknownRequestError) {
        return error.message
    }
    if (error instanceof Prisma.PrismaClientRustPanicError) {
        return error.message
    }
    if (error instanceof Prisma.PrismaClientInitializationError) {
        return error.message
    }
    if (error instanceof Prisma.PrismaClientValidationError) {
        return error.message
    }
    return `Unknown error: ${error}`
}
