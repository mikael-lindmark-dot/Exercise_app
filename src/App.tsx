import { Header } from './components/Header'
import { Nav } from './components/Nav'
import {
  usePersistedAdaptations,
  usePersistedBoolean,
  usePersistedCheckIn,
  usePersistedNumber,
  usePersistedProfile,
  usePersistedSessionHistory,
  usePersistedScreen,
  useStorageWarning,
} from './logic/persistence'
import {
  adaptationsFromCheckIn,
  adaptationsFromProfile,
  buildWeekPlan,
} from './logic/recommendations'
import { OnboardingScreen } from './screens/OnboardingScreen'
import { CheckInScreen } from './screens/CheckInScreen'
import { LibraryScreen } from './screens/LibraryScreen'
import { OverviewScreen } from './screens/OverviewScreen'
import { PlanScreen } from './screens/PlanScreen'
import { ProfileScreen } from './screens/ProfileScreen'
import { ProgressScreen } from './screens/ProgressScreen'
import { TodayScreen } from './screens/TodayScreen'
import { WorkoutScreen } from './screens/WorkoutScreen'
import type { Adaptations, CompletedSession, Screen, SessionCheckIn, UserProfile } from './types/app'

function App() {
  const [screen, setScreen] = usePersistedScreen()
  const [profile, setProfile] = usePersistedProfile()
  const [adaptations, setAdaptations] = usePersistedAdaptations()
  const [exerciseIndex, setExerciseIndex] = usePersistedNumber('evolve-exercise-index', 0)
  const [isPlaying, setIsPlaying] = usePersistedBoolean('evolve-is-playing', false)
  const [completed, setCompleted] = usePersistedBoolean('evolve-completed', false)
  const [latestCheckIn, setLatestCheckIn] = usePersistedCheckIn()
  const [sessionHistory, setSessionHistory] = usePersistedSessionHistory()
  const [selectedDayIndex, setSelectedDayIndex] = usePersistedNumber('evolve-selected-day-index', 0)
  const storageWarning = useStorageWarning()

  const activeScreen = profile.completedOnboarding ? screen : 'onboarding'
  const generatedWeekPlan = buildWeekPlan(adaptations, profile)
  const selectedDay = generatedWeekPlan[selectedDayIndex] ?? generatedWeekPlan[0]
  const sessionPlan = selectedDay.session
  const sessionExercises = sessionPlan.exercises
  const currentExercise = sessionExercises[exerciseIndex] ?? sessionExercises[0]
  const progressPercent = completed
    ? 100
    : Math.round((exerciseIndex / sessionExercises.length) * 100)

  const goTo = (next: Screen) => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    document.querySelector('.content-frame')?.scrollTo({
      top: 0,
      behavior: 'instant',
    })
    setScreen(next)
  }

  const appClasses = [
    'app-shell',
    profile.accessibility.reducedMotion ? 'reduced-motion' : '',
    profile.accessibility.largeText ? 'large-text' : '',
    profile.accessibility.highContrast ? 'high-contrast' : '',
  ]
    .filter(Boolean)
    .join(' ')

  const completeOnboarding = (nextProfile: UserProfile) => {
    const completedProfile = { ...nextProfile, completedOnboarding: true }
    setProfile(completedProfile)
    setAdaptations(adaptationsFromProfile(completedProfile))
    setSelectedDayIndex(0)
    goTo('today')
  }

  const saveProfile = (nextProfile: UserProfile, nextAdaptations: Adaptations) => {
    setProfile(nextProfile)
    const { accessibility: previousAccessibility, ...previousTraining } = profile
    const { accessibility: nextAccessibility, ...nextTraining } = nextProfile
    void previousAccessibility
    void nextAccessibility
    if (JSON.stringify(previousTraining) === JSON.stringify(nextTraining)) return
    setAdaptations(nextAdaptations)
    setSelectedDayIndex(0)
    setExerciseIndex(0)
    setCompleted(false)
    setIsPlaying(false)
  }

  const resetSetup = () => {
    setProfile({ ...profile, completedOnboarding: false })
    setSelectedDayIndex(0)
    setExerciseIndex(0)
    setCompleted(false)
    setIsPlaying(false)
    goTo('onboarding')
  }

  const startWorkout = () => {
    setExerciseIndex(0)
    setCompleted(false)
    setIsPlaying(true)
    goTo('workout')
  }

  const openPlannedSession = (dayIndex: number) => {
    const plannedDay = generatedWeekPlan[dayIndex]
    if (!plannedDay?.isTrainingDay) return

    setSelectedDayIndex(dayIndex)
    setExerciseIndex(0)
    setCompleted(false)
    setIsPlaying(false)
    goTo('overview')
  }

  const nextExercise = () => {
    if (exerciseIndex >= sessionExercises.length - 1) {
      if (completed) return
      const completedAt = new Date().toISOString()
      const completedSession: CompletedSession = {
        id: `session-${crypto.randomUUID()}`,
        title: sessionPlan.title,
        completedAt,
        durationMinutes: sessionPlan.durationMinutes,
        exerciseCount: sessionExercises.length,
        tracks: sessionPlan.tracks,
        adaptations: selectedDay.adaptations,
        checkIn: null,
      }
      setSessionHistory([completedSession, ...sessionHistory])
      setCompleted(true)
      setIsPlaying(false)
      goTo('checkin')
      return
    }

    setExerciseIndex(exerciseIndex + 1)
  }

  const saveCheckIn = (checkIn: SessionCheckIn) => {
    const finishedSession = sessionHistory[0]
    if (!completed || !finishedSession || finishedSession.checkIn) return
    setSessionHistory([{ ...finishedSession, checkIn }, ...sessionHistory.slice(1)])
    setLatestCheckIn(checkIn)
    setAdaptations(adaptationsFromCheckIn(adaptations, checkIn))
  }

  return (
    <main className={appClasses}>
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <section className="device-frame" aria-label="Evolve mobile and iPad app prototype">
        <Header screen={activeScreen} goTo={goTo} profile={profile} />

        <div className="content-frame">
          {storageWarning && (
            <p className="safety-note" role="alert">
              Browser storage is unavailable or full. Your changes are kept in this tab,
              but may be lost when you reload or close it. Free storage before continuing.
            </p>
          )}
          {activeScreen === 'onboarding' && (
            <OnboardingScreen
              profile={profile}
              completeOnboarding={completeOnboarding}
            />
          )}

          {activeScreen === 'today' && (
            <TodayScreen
              adaptations={adaptations}
              setAdaptations={setAdaptations}
              goTo={goTo}
              sessionPlan={sessionPlan}
              completed={completed}
            />
          )}

          {activeScreen === 'plan' && (
            <PlanScreen
              adaptations={adaptations}
              setAdaptations={setAdaptations}
              profile={profile}
              weekPlan={generatedWeekPlan}
              selectedDayIndex={selectedDayIndex}
              openPlannedSession={openPlannedSession}
            />
          )}

          {activeScreen === 'library' && <LibraryScreen />}

          {activeScreen === 'profile' && (
            <ProfileScreen
              profile={profile}
              saveProfile={saveProfile}
              resetSetup={resetSetup}
              goTo={goTo}
            />
          )}

          {activeScreen === 'overview' && (
            <OverviewScreen
              goTo={goTo}
              startWorkout={startWorkout}
              adaptations={adaptations}
              sessionPlan={sessionPlan}
            />
          )}

          {activeScreen === 'workout' && currentExercise && (
            <WorkoutScreen
              goTo={goTo}
              currentExercise={currentExercise}
              exerciseIndex={exerciseIndex}
              totalExercises={sessionExercises.length}
              isPlaying={isPlaying}
              setIsPlaying={setIsPlaying}
              setExerciseIndex={setExerciseIndex}
              nextExercise={nextExercise}
              adaptations={adaptations}
              progressPercent={progressPercent}
            />
          )}

          {activeScreen === 'checkin' && (
            <CheckInScreen saveCheckIn={saveCheckIn} goTo={goTo} />
          )}

          {activeScreen === 'progress' && (
            <ProgressScreen
              goTo={goTo}
              completed={completed}
              progressPercent={progressPercent}
              sessionExercises={sessionExercises}
              latestCheckIn={latestCheckIn}
              sessionHistory={sessionHistory}
              resetOnboarding={resetSetup}
            />
          )}
        </div>

        {activeScreen !== 'onboarding' && <Nav screen={activeScreen} goTo={goTo} />}
      </section>
    </main>
  )
}

export default App
