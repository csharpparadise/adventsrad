import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TeamMateService } from 'src/services/team-mate.service';

@Component({
    selector: 'app-mates',
    templateUrl: './mates.component.html',
    styleUrls: ['./mates.component.css'],
    standalone: false
})
export class MatesComponent implements OnInit {

  @Output() onMatelistChanged = new EventEmitter<any>();

  members: string[] = [];
  isEditing: boolean = false;
  newMateName: string = '';

  constructor(private teamService: TeamMateService) {
    this.loadMembers();
  }

  ngOnInit() {
  }

  loadMembers() {
    this.members = this.teamService.getPlayers();
  }

  public won(member: string) {
    if (this.members.length > 1) {
      this.teamService.removePlayer(member, this.isEditing);
      this.loadMembers();

      this.onMatelistChanged.emit();
    }
    else {
      this.reset();
    }
  }

  public reset() {
    this.teamService.restorePlayers();
    this.loadMembers();

    this.onMatelistChanged.emit();
  }

  public editMateList() {
    this.isEditing = !this.isEditing;
  }

  public addMate() {
    const name = this.newMateName.trim();
    if (!name) return;
    if (this.members.includes(name)) return;
    this.teamService.addPlayers([name]);
    this.loadMembers();
    this.newMateName = '';
    this.onMatelistChanged.emit();
  }

  public removeMate(member: string) {
    this.teamService.removePlayer(member, true); // permanent: also removes from backup store
    this.loadMembers();
    this.onMatelistChanged.emit();
  }
}
