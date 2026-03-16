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

          const grouped: Record<string, PlayerWithPosition[]> = {
            Arco: [],
            Def: [],
            Medio: [],
            Del: [],
            Jugador: [],
          }
          for (let i = 0; i < shuffledPlayers.length; i++) {
            const player = shuffledPlayers[i]
            if (grouped[player.position]) {
              grouped[player.position].push(player)
            }
          }

          const positionRank: Record<string, number> = {
            Arco: 0,
            Def: 1,
            Medio: 2,
            Del: 3,
            Jugador: 4,
          }
          const comparePositions = (a: PlayerWithPosition, b: PlayerWithPosition) => {
            return (positionRank[a.position] ?? 5) - (positionRank[b.position] ?? 5)
          }

          const newTeamOne: PlayerWithPosition[] = []
          const newTeamTwo: PlayerWithPosition[] = []

          const allPlayersOrdered = [
            ...grouped.Arco,
            ...grouped.Def,
            ...grouped.Medio,
            ...grouped.Del,
            ...grouped.Jugador,
          ]

          allPlayersOrdered.forEach((player, index) => {
            if (index % 2 === 0) newTeamOne.push(player)
            else newTeamTwo.push(player)
          })

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
          const positionRank: Record<string, number> = {
            Arco: 0,
            Def: 1,
            Medio: 2,
            Del: 3,
            Jugador: 4,
          }
          const comparePositions = (a: PlayerWithPosition, b: PlayerWithPosition) => {
            return (positionRank[a.position] ?? 5) - (positionRank[b.position] ?? 5)
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