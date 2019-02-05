kontu = Club.create! name: 'FC Kontu'
mps = Club.create! name: 'MPS'
viikingit = Club.create! name: 'FC Viikingit'
hjk = Club.create! name: 'HJK'
honka = Club.create! name: 'Honka'
lps = Club.create! name: 'LPS'

Tournament.create! name: 'Futsal Cup 2019', start_date: '2019-03-30', days: 1, location: 'Myllypuro'
t = Tournament.create! name: 'Fudis Cup 2019', start_date: '2019-05-12', days: 2, location: 'Itä-Helsinki'

f1 = Field.create! tournament: t, name: 'Kenttä 1'
f2 = Field.create! tournament: t, name: 'Kenttä 2'

ag1 = AgeGroup.create! tournament: t, name: 'P06 Haaste'
ag2 = AgeGroup.create! tournament: t, name: 'P06 Harraste'

g_a = Group.create! age_group: ag1, name: 'A'
g_b = Group.create! age_group: ag1, name: 'B'
Group.create! age_group: ag2, name: 'C'
Group.create! age_group: ag2, name: 'D'

kontu_valkoinen = Team.create! club: kontu, group: g_a, name: 'Kontu Valkoinen', group_stage_number: 1
mps_musta = Team.create! club: mps, group: g_a, name: 'MPS Musta', group_stage_number: 2
viikingit_punainen = Team.create! club: viikingit, group: g_a, name: 'Viikingit Punainen', group_stage_number: 3
hjk_east = Team.create! club: hjk, group: g_a, name: 'HJK East', group_stage_number: 4

honka_keltainen = Team.create! club: honka, group: g_b, name: 'Honka Keltainen', group_stage_number: 1
hjk_keltainen = Team.create! club: hjk, group: g_b, name: 'HJK Keltainen', group_stage_number: 2
lps_valkoinen = Team.create! club: lps, group: g_b, name: 'LPS Valkoinen', group_stage_number: 3
viikingit_vihrea = Team.create! club: viikingit, group: g_b, name: 'Viikingit Vihreä', group_stage_number: 4

GroupStageMatch.create! group: g_a, field: f1, start_time: '2019-05-12 09:00', home_team: kontu_valkoinen, away_team: mps_musta
GroupStageMatch.create! group: g_a, field: f2, start_time: '2019-05-12 09:00', home_team: viikingit_punainen, away_team: hjk_east
GroupStageMatch.create! group: g_a, field: f1, start_time: '2019-05-12 10:00', home_team: kontu_valkoinen, away_team: viikingit_punainen
GroupStageMatch.create! group: g_a, field: f2, start_time: '2019-05-12 10:00', home_team: mps_musta, away_team: hjk_east
GroupStageMatch.create! group: g_a, field: f1, start_time: '2019-05-12 12:00', home_team: hjk_east, away_team: kontu_valkoinen
GroupStageMatch.create! group: g_a, field: f2, start_time: '2019-05-12 12:00', home_team: mps_musta, away_team: viikingit_punainen

GroupStageMatch.create! group: g_b, field: f1, start_time: '2019-05-12 09:30', home_team: honka_keltainen, away_team: hjk_keltainen
GroupStageMatch.create! group: g_b, field: f2, start_time: '2019-05-12 09:30', home_team: lps_valkoinen, away_team: viikingit_vihrea
GroupStageMatch.create! group: g_b, field: f1, start_time: '2019-05-12 10:30', home_team: honka_keltainen, away_team: lps_valkoinen
GroupStageMatch.create! group: g_b, field: f2, start_time: '2019-05-12 10:30', home_team: hjk_keltainen, away_team: viikingit_vihrea
GroupStageMatch.create! group: g_b, field: f1, start_time: '2019-05-12 12:30', home_team: viikingit_vihrea, away_team: honka_keltainen
GroupStageMatch.create! group: g_b, field: f2, start_time: '2019-05-12 12:30', home_team: hjk_keltainen, away_team: lps_valkoinen
