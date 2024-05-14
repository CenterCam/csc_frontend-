import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useContext } from 'react'
import { Store } from '@/Utils/Store'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { proxy } from '@/Utils/Utils'
import { toast } from 'sonner'
  

export default function ProgramDailog({isOpen,setOpen}) {

  
  const formSchema = z.object({
    name: z.string().min(1,{
      message: "Name must be at least 1 characters",
    }),
  })

  const form = useForm({
      resolver: zodResolver(formSchema),
      defaultValues: {
          name: "",
        },
    })

    const {state , dispatch} = useContext(Store);
    const {csc_user} = state;
    const queryClient = useQueryClient();

    const onSubmit = async (data) => {
      await createProgramMutation(data);
     }

     const { isPending , mutateAsync : createProgramMutation } = useMutation({
        mutationFn : async (state)=>{
          try {
            const response = await axios.post(`${proxy}/api/program/create`,
              {
                name : state.name,
              }
              ,
              {
                headers : {
                  authorization : `Bearer ${csc_user.token}`
              }
              }
            )  
          } catch (error) {
            throw error;
          }
        },
        onSuccess : () => {
          queryClient.invalidateQueries(['data']);
          toast.success("Country Is Created Successfully");
          setOpen(!isOpen);
          form.reset();
        },
        onError : (err) => {
          toast.error(err.response.data.message);
        }
      })
     

  return (
    <>
        <Dialog open={isOpen} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                <DialogTitle>Create Program</DialogTitle>
                <Form {...form} className="space-y-8 flex flex-col mt-9">
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                          <FormItem>
                              <FormLabel>Name</FormLabel>
                              <FormControl>
                                  <Input placeholder="Program Name" {...field} />
                              </FormControl>
                              <FormMessage />
                          </FormItem>
                      )}
                      />
                      <div className='flex flex-col'>
                          <Button disabled={isPending} type="submit">Submit</Button>
                      </div>
                  </form>
                  </Form>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    </>
  )
}
