kontu = Club.create! name: 'FC Kontu'
mps = Club.create! name: 'MPS'
viikingit = Club.create! name: 'FC Viikingit'
hjk = Club.create! name: 'HJK'

Tournament.create! name: 'Futsal Cup 2019', start_date: '2019-03-30', days: 1, location: 'Myllypuro'
t = Tournament.create! name: 'Fudis Cup 2019', start_date: '2019-05-12', days: 2, location: 'Itä-Helsinki'

f1 = Field.create! tournament: t, name: 'Kenttä 1'
f2 = Field.create! tournament: t, name: 'Kenttä 2'

ag1 = AgeGroup.create! tournament: t, name: 'P06 Haaste'
ag2 = AgeGroup.create! tournament: t, name: 'P06 Harraste'

g_a = Group.create! age_group: ag1, name: 'A'
Group.create! age_group: ag1, name: 'B'
Group.create! age_group: ag2, name: 'C'
Group.create! age_group: ag2, name: 'D'

kontu_valkoinen = Team.create! club: kontu, group: g_a, name: 'Kontu Valkoinen', group_stage_number: 1
mps_musta = Team.create! club: mps, group: g_a, name: 'MPS Musta', group_stage_number: 2
viikingit_punainen = Team.create! club: viikingit, group: g_a, name: 'Viikingit Punainen', group_stage_number: 3
hjk_east = Team.create! club: hjk, group: g_a, name: 'HJK East', group_stage_number: 4

GroupStageMatch.create! group: g_a, field: f1, start_time: '2019-05-12 09:00', home_team: kontu_valkoinen, away_team: mps_musta
GroupStageMatch.create! group: g_a, field: f2, start_time: '2019-05-12 09:00', home_team: viikingit_punainen, away_team: hjk_east
GroupStageMatch.create! group: g_a, field: f1, start_time: '2019-05-12 10:00', home_team: kontu_valkoinen, away_team: viikingit_punainen
GroupStageMatch.create! group: g_a, field: f2, start_time: '2019-05-12 10:00', home_team: mps_musta, away_team: hjk_east
GroupStageMatch.create! group: g_a, field: f1, start_time: '2019-05-12 12:00', home_team: hjk_east, away_team: kontu_valkoinen
GroupStageMatch.create! group: g_a, field: f2, start_time: '2019-05-12 12:00', home_team: mps_musta, away_team: viikingit_punainen
