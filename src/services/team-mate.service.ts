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
    const adventPlayersBackup = this.readPlayers(this.BACKUP_KEY);
    if (!adventPlayersBackup) {
      const playersJson = JSON.stringify(this.team);
      localStorage.setItem(this.BACKUP_KEY, playersJson);
    }
  }

  getPlayers(): string[] {
    const playersInStore = this.readPlayers(this.STORAGE_KEY);

    if (!playersInStore) {
      this.restorePlayers();
      return this.team;
    }

    return playersInStore;
  }

  addPlayers(newPlayers: string[]) {
    const backupPlayers = this.readPlayers(this.BACKUP_KEY) ?? [];
    const playersInGame = this.getPlayers();
    const uniqueNewPlayers = newPlayers.filter(
      (player, index) => !playersInGame.includes(player) && newPlayers.indexOf(player) === index,
    );
    if (!uniqueNewPlayers.length) return;

    const playersNewToBackup = uniqueNewPlayers.filter(player => !backupPlayers.includes(player));
    if (playersNewToBackup.length) {
      backupPlayers.push(...playersNewToBackup);
      localStorage.setItem(this.BACKUP_KEY, JSON.stringify(backupPlayers));
    }

    playersInGame.push(...uniqueNewPlayers);
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
      const backupPlayers = this.readPlayers(this.BACKUP_KEY);
      if (playersInBackupStore && backupPlayers) {
        const backupIndex = backupPlayers.indexOf(player);
        if (backupIndex !== -1) {
          backupPlayers.splice(backupIndex, 1);
          localStorage.setItem(this.BACKUP_KEY, JSON.stringify(backupPlayers));
        }
      }
    }
  }

  restorePlayers() {
    const playersInBackupStore = this.readPlayers(this.BACKUP_KEY);
    if (playersInBackupStore) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(playersInBackupStore));
    }
  }

  private readPlayers(key: string): string[] | null {
    const value = localStorage.getItem(key);
    if (!value) return null;

    try {
      const players: unknown = JSON.parse(value);
      return Array.isArray(players) && players.every(player => typeof player === 'string')
        ? players
        : null;
    } catch {
      return null;
    }
  }
}
