kontu = Club.create! name: 'FC Kontu'
mps = Club.create! name: 'MPS'
viikingit = Club.create! name: 'FC Viikingit'
hjk = Club.create! name: 'HJK'
honka = Club.create! name: 'Honka'
lps = Club.create! name: 'LPS'

Tournament.create! name: 'Futsal Cup 2019', start_date: '2019-03-30', days: 1, location: 'Myllypuro', address: 'Alakiventie 2, 00920 Helsinki'
t = Tournament.create! name: 'Fudis Cup 2019', start_date: '2019-05-12', days: 2, location: 'Itä-Helsinki', address: 'Tanhuantie 4-6, 00940 Helsinki'

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

b_semi1 = PlayoffMatch.create! age_group: ag1, field: f1, start_time: '2019-05-12 14:00', home_team_origin: g_a, away_team_origin: g_b, home_team_origin_rule: 3, away_team_origin_rule: 4, title: 'A3-B4'
b_semi2 = PlayoffMatch.create! age_group: ag1, field: f2, start_time: '2019-05-12 14:00', home_team_origin: g_b, away_team_origin: g_a, home_team_origin_rule: 3, away_team_origin_rule: 4, title: 'B3-A4'
semi1 = PlayoffMatch.create! age_group: ag1, field: f1, start_time: '2019-05-12 14:30', home_team_origin: g_a, away_team_origin: g_b, home_team_origin_rule: 1, away_team_origin_rule: 2, title: 'A1-B2'
semi2 = PlayoffMatch.create! age_group: ag1, field: f2, start_time: '2019-05-12 14:30', home_team_origin: g_b, away_team_origin: g_a, home_team_origin_rule: 1, away_team_origin_rule: 2, title: 'B1-A2'

PlayoffMatch.create! age_group: ag1, field: f1, start_time: '2019-05-12 15:00', home_team_origin: b_semi1, away_team_origin: b_semi2, home_team_origin_rule: PlayoffMatch::RULE_WINNER, away_team_origin_rule: PlayoffMatch::RULE_WINNER, title: '5-6'
PlayoffMatch.create! age_group: ag1, field: f2, start_time: '2019-05-12 15:00', home_team_origin: b_semi1, away_team_origin: b_semi2, home_team_origin_rule: PlayoffMatch::RULE_LOSER, away_team_origin_rule: PlayoffMatch::RULE_LOSER, title: '7-8'
PlayoffMatch.create! age_group: ag1, field: f1, start_time: '2019-05-12 15:30', home_team_origin: semi1, away_team_origin: semi2, home_team_origin_rule: PlayoffMatch::RULE_WINNER, away_team_origin_rule: PlayoffMatch::RULE_WINNER, title: 'Finaali'
PlayoffMatch.create! age_group: ag1, field: f2, start_time: '2019-05-12 15:30', home_team_origin: semi1, away_team_origin: semi2, home_team_origin_rule: PlayoffMatch::RULE_LOSER, away_team_origin_rule: PlayoffMatch::RULE_LOSER, title: 'Pronssiottelu'
