import MainVisual from './_components/MainVisual'
import DogWalkForm from './_components/DogWalkForm'

export default function Home() {
  return (
    <div className="min-h-screen">
      <MainVisual />
      <div className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          <DogWalkForm />
        </div>
      </div>
    </div>
  )
}
