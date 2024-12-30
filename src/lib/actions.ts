"use server"

import { revalidatePath } from "next/cache";
import { SubjectSchema } from "./formValidationsSchemas"
import prisma from "./prisma";
import { boolean } from "zod";
import { error } from "console";

export const createSubject = async (currentState:{success:boolean,error:boolean},data:SubjectSchema)=> {
    try{
        await prisma.subject.create({
            data:{
                name:data.name
            }
        })
        revalidatePath("/list/subjects")
        return {success:true,error:false}

    }catch(err){
        console.log(err);
        return {success:false,error:true}
        
    }

}