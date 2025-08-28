import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type { PlayerWithPosition, TeamsData } from '@/types'
import { shuffle } from 'lodash'

interface TeamState {
  // State
  players: string[]
  teamsData: TeamsData | null
  currentStep: 'form' | 'positions' | 'teams'
  
  // Actions
  setPlayers: (players: string[]) => void
  setTeamsData: (data: TeamsData) => void
  setCurrentStep: (step: 'form' | 'positions' | 'teams') => void
  updateTeams: (teamOne: PlayerWithPosition[], teamTwo: PlayerWithPosition[]) => void
  redistributeTeams: () => void
  swapPlayers: (
    fromTeam: 'teamOne' | 'teamTwo',
    toTeam: 'teamOne' | 'teamTwo',
    fromIndex: number,
    toIndex: number,
    draggedPlayer: PlayerWithPosition,
    targetPlayer: PlayerWithPosition
  ) => void
  resetTeams: () => void
}

export const useTeamStore = create<TeamState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        players: [],
        teamsData: null,
        currentStep: 'form',

        // Actions
        setPlayers: (players) => {
          set({ players, currentStep: 'positions' }, false, 'setPlayers')
        },

        setTeamsData: (data) => {
          set({ teamsData: data, currentStep: 'teams' }, false, 'setTeamsData')
        },

        setCurrentStep: (step) => {
          set({ currentStep: step }, false, 'setCurrentStep')
        },

        updateTeams: (teamOne, teamTwo) => {
          const { teamsData } = get()
          if (teamsData) {
            set(
              {
                teamsData: {
                  teamOne,
                  teamTwo,
                },
              },
              false,
              'updateTeams'
            )
          }
        },

        redistributeTeams: () => {
          const { teamsData } = get()
          if (!teamsData) return

          const allPlayers = [...teamsData.teamOne, ...teamsData.teamTwo]
          const shuffledPlayers = shuffle([...allPlayers])

          // Group by positions
          const goalkeepers = shuffledPlayers.filter(p => p.position === 'Arco')
          const defenders = shuffledPlayers.filter(p => p.position === 'Def')
          const midfielders = shuffledPlayers.filter(p => p.position === 'Medio')
          const forwards = shuffledPlayers.filter(p => p.position === 'Del')
          const players = shuffledPlayers.filter(p => p.position === 'Jugador')

          const positionOrder = ['Arco', 'Def', 'Medio', 'Del', 'Jugador']
          const comparePositions = (a: PlayerWithPosition, b: PlayerWithPosition) => {
            return positionOrder.indexOf(a.position) - positionOrder.indexOf(b.position)
          }

          const newTeamOne: PlayerWithPosition[] = []
          const newTeamTwo: PlayerWithPosition[] = []

          // Distribute players alternately
          const allPlayersOrdered = [
            ...goalkeepers,
            ...defenders,
            ...midfielders,
            ...forwards,
            ...players,
          ]

          allPlayersOrdered.forEach((player, index) => {
            if (index % 2 === 0) newTeamOne.push(player)
            else newTeamTwo.push(player)
          })

          // Sort teams by position
          newTeamOne.sort(comparePositions)
          newTeamTwo.sort(comparePositions)

          set(
            {
              teamsData: {
                teamOne: newTeamOne,
                teamTwo: newTeamTwo,
              },
            },
            false,
            'redistributeTeams'
          )
        },

        swapPlayers: (fromTeam, toTeam, fromIndex, toIndex, draggedPlayer, targetPlayer) => {
          const { teamsData } = get()
          if (!teamsData) return

          const newTeamOne = [...teamsData.teamOne]
          const newTeamTwo = [...teamsData.teamTwo]

          if (fromTeam === toTeam) {
            // Same team swap - just swap positions in array
            const team = fromTeam === 'teamOne' ? newTeamOne : newTeamTwo
            ;[team[fromIndex], team[toIndex]] = [team[toIndex], team[fromIndex]]
          } else {
            // Different teams - swap players between teams with position inheritance
            if (fromTeam === 'teamOne') {
              newTeamOne[fromIndex] = { ...targetPlayer, position: draggedPlayer.position }
              newTeamTwo[toIndex] = { ...draggedPlayer, position: targetPlayer.position }
            } else {
              newTeamTwo[fromIndex] = { ...targetPlayer, position: draggedPlayer.position }
              newTeamOne[toIndex] = { ...draggedPlayer, position: targetPlayer.position }
            }
          }

          // Sort teams by position after swap
          const positionOrder = ['Arco', 'Def', 'Medio', 'Del', 'Jugador']
          const comparePositions = (a: PlayerWithPosition, b: PlayerWithPosition) => {
            return positionOrder.indexOf(a.position) - positionOrder.indexOf(b.position)
          }

          newTeamOne.sort(comparePositions)
          newTeamTwo.sort(comparePositions)

          set(
            {
              teamsData: {
                teamOne: newTeamOne,
                teamTwo: newTeamTwo,
              },
            },
            false,
            'swapPlayers'
          )
        },

        resetTeams: () => {
          set(
            {
              players: [],
              teamsData: null,
              currentStep: 'form',
            },
            false,
            'resetTeams'
          )
        },
      }),
      {
        name: 'team-storage',
        partialize: (state) => ({
          players: state.players,
          teamsData: state.teamsData,
          currentStep: state.currentStep,
        }),
        skipHydration: true,
      }
    ),
    { name: 'TeamStore' }
  )
)