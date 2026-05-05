import { TestBed } from '@angular/core/testing';
import { TeamMateService } from './team-mate.service';

describe('TeamMateService', () => {
  let service: TeamMateService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeamMateService);
  });

  afterEach(() => localStorage.clear());

  describe('initPlayerStorage', () => {
    it('should write the default team to backup storage on first init', () => {
      const backup = localStorage.getItem('advent_players_backup');
      expect(JSON.parse(backup!)).toEqual(['Ralf', 'André', 'Sylvia', 'Stefan', 'Patrick', 'Andreas']);
    });

    it('should not overwrite an existing backup on re-init', () => {
      localStorage.setItem('advent_players_backup', JSON.stringify(['Alice']));
      new TeamMateService();
      expect(JSON.parse(localStorage.getItem('advent_players_backup')!)).toEqual(['Alice']);
    });
  });

  describe('getPlayers', () => {
    it('should return the active player list from storage', () => {
      localStorage.setItem('advent_players', JSON.stringify(['Alice', 'Bob']));
      expect(service.getPlayers()).toEqual(['Alice', 'Bob']);
    });

    it('should restore from backup and return default team when active storage is empty', () => {
      localStorage.removeItem('advent_players');
      expect(service.getPlayers()).toEqual(['Ralf', 'André', 'Sylvia', 'Stefan', 'Patrick', 'Andreas']);
    });
  });

  describe('addPlayers', () => {
    it('should add new players to the active list', () => {
      service.addPlayers(['Alice']);
      expect(service.getPlayers()).toContain('Alice');
    });

    it('should also persist new players to the backup list', () => {
      service.addPlayers(['Alice']);
      const backup = JSON.parse(localStorage.getItem('advent_players_backup')!);
      expect(backup).toContain('Alice');
    });
  });

  describe('removePlayer', () => {
    beforeEach(() => {
      localStorage.setItem('advent_players', JSON.stringify(['Alice', 'Bob', 'Carol']));
      localStorage.setItem('advent_players_backup', JSON.stringify(['Alice', 'Bob', 'Carol']));
    });

    it('should remove the player from the active list', () => {
      service.removePlayer('Bob', false);
      expect(service.getPlayers()).toEqual(['Alice', 'Carol']);
    });

    it('should NOT remove the player from backup when isEditing is false', () => {
      service.removePlayer('Bob', false);
      const backup = JSON.parse(localStorage.getItem('advent_players_backup')!);
      expect(backup).toContain('Bob');
    });

    it('should remove the player from backup too when isEditing is true', () => {
      service.removePlayer('Bob', true);
      const backup = JSON.parse(localStorage.getItem('advent_players_backup')!);
      expect(backup).not.toContain('Bob');
      expect(backup).toEqual(['Alice', 'Carol']);
    });

    it('should leave the rest of the active list intact', () => {
      service.removePlayer('Bob', false);
      expect(service.getPlayers()).toContain('Alice');
      expect(service.getPlayers()).toContain('Carol');
    });
  });

  describe('restorePlayers', () => {
    it('should copy backup players into the active list', () => {
      localStorage.setItem('advent_players', JSON.stringify(['Alice']));
      localStorage.setItem('advent_players_backup', JSON.stringify(['Alice', 'Bob', 'Carol']));
      service.restorePlayers();
      expect(service.getPlayers()).toEqual(['Alice', 'Bob', 'Carol']);
    });
  });
});
