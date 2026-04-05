'use client'

import { Suspense } from 'react'
import Home from '@/src/pages/Home'
import HomeEntryRefCapture from './HomeEntryRefCapture'

export default function Page() {
  return (
    <>
      <Suspense fallback={null}>
        <HomeEntryRefCapture />
      </Suspense>
      <Home />
    </>
  )
}
