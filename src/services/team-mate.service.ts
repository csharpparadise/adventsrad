import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TeamMateService {

  readonly team = ['Ralf', 'André', 'Sylvia', 'Stefan', 'Patrick', 'Andreas'];
  readonly STORAGE_KEY = 'advent_players';
  readonly BACKUP_KEY = 'advent_players_backup';

  constructor() {
    this.initPlayerStorage();
   }

  initPlayerStorage() {
    const advent_players_backup = localStorage.getItem(this.BACKUP_KEY);
    if (!advent_players_backup) {
      const playersJson = JSON.stringify(this.team);
      localStorage.setItem(this.BACKUP_KEY, playersJson);
    }
  }

  getPlayers(): string[] {
    const playersInStore = localStorage.getItem(this.STORAGE_KEY);

    if (!playersInStore) {
      this.restorePlayers();
      return this.team;
    }

    return JSON.parse(playersInStore);
  }

  addPlayers(newPlayers: string[]) {
    const playersInBackupStore = localStorage.getItem(this.BACKUP_KEY);
    const players = playersInBackupStore ? JSON.parse(playersInBackupStore) : [];
    players.push(...newPlayers);

    const playersJson = JSON.stringify(players);
    localStorage.setItem(this.BACKUP_KEY, playersJson);

    const playersInGame = this.getPlayers();
    playersInGame.push(...newPlayers);
    const currentPlayersJson = JSON.stringify(playersInGame);
    localStorage.setItem(this.STORAGE_KEY, currentPlayersJson);
  }

  removePlayer(player: string, isEditing: boolean) {
    const players = this.getPlayers();
    const index = players.indexOf(player);
    players.splice(index, 1);

    const playersJson = JSON.stringify(players);
    localStorage.setItem(this.STORAGE_KEY, playersJson);

    if (isEditing) {
      const playersInBackupStore = localStorage.getItem(this.BACKUP_KEY);
      if (playersInBackupStore) {
        const backupPlayers = JSON.parse(playersInBackupStore);
        const backupIndex = backupPlayers.indexOf(player);
        backupPlayers.splice(backupIndex, 1);
        localStorage.setItem(this.BACKUP_KEY, JSON.stringify(backupPlayers));
      }
    }
  }

  restorePlayers() {
    const playersInBackupStore = localStorage.getItem(this.BACKUP_KEY);
    if (playersInBackupStore) {
      localStorage.setItem(this.STORAGE_KEY, playersInBackupStore);
    }
  }
}
