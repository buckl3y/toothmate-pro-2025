'use client'

import { useState } from 'react'
import { Button } from "./button"
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "./input"
import { PlusIcon } from "lucide-react"

export default function AddNewChartButton() {
    // const [isOpen, setIsOpen] = useState(false)
    // const [procedure, setProcedure] = useState('')
  
    // const handleSubmit = (e) => {
    //   e.preventDefault()
    //   console.log('New chart added:', procedure)
    //   setProcedure('')
    //   setIsOpen(false)
    // }

  return (<></>
    // <Dialog open={isOpen} onOpenChange={setIsOpen}>
    //   <DialogTrigger asChild>
    //     <Button>
    //       <PlusIcon className="mr-2 h-4 w-4" />
    //       Add New Chart
    //     </Button>
    //   </DialogTrigger>
    //   <DialogContent className="sm:max-w-[425px]">
    //     <DialogHeader>
    //       <DialogTitle>Add New Chart</DialogTitle>
    //     </DialogHeader>
    //     <form onSubmit={handleSubmit} className="space-y-4">
    //       <Input
    //         placeholder="Procedure"
    //         value={procedure}
    //         onChange={(e) => setProcedure(e.target.value)}
    //       />
    //       <Button type="submit" className="w-full">Submit</Button>
    //     </form>
    //   </DialogContent>
    // </Dialog>
  )
}