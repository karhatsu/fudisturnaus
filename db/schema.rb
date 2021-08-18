# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2021_08_10_090713) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "age_groups", force: :cascade do |t|
    t.bigint "tournament_id", null: false
    t.string "name", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "calculate_group_tables", default: false, null: false
    t.index ["tournament_id"], name: "index_age_groups_on_tournament_id"
  end

  create_table "clubs", force: :cascade do |t|
    t.string "name", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "logo_url"
    t.string "alias"
  end

  create_table "fields", force: :cascade do |t|
    t.bigint "tournament_id", null: false
    t.string "name", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["tournament_id"], name: "index_fields_on_tournament_id"
  end

  create_table "friendly_id_slugs", force: :cascade do |t|
    t.string "slug", null: false
    t.integer "sluggable_id", null: false
    t.string "sluggable_type", limit: 50
    t.string "scope"
    t.datetime "created_at"
    t.index ["slug", "sluggable_type", "scope"], name: "index_friendly_id_slugs_on_slug_and_sluggable_type_and_scope", unique: true
    t.index ["slug", "sluggable_type"], name: "index_friendly_id_slugs_on_slug_and_sluggable_type"
    t.index ["sluggable_type", "sluggable_id"], name: "index_friendly_id_slugs_on_sluggable_type_and_sluggable_id"
  end

  create_table "group_stage_matches", force: :cascade do |t|
    t.bigint "group_id", null: false
    t.bigint "field_id", null: false
    t.datetime "start_time", null: false
    t.bigint "home_team_id", null: false
    t.bigint "away_team_id", null: false
    t.integer "home_goals"
    t.integer "away_goals"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["away_team_id"], name: "index_group_stage_matches_on_away_team_id"
    t.index ["field_id"], name: "index_group_stage_matches_on_field_id"
    t.index ["group_id"], name: "index_group_stage_matches_on_group_id"
    t.index ["home_team_id"], name: "index_group_stage_matches_on_home_team_id"
  end

  create_table "groups", force: :cascade do |t|
    t.bigint "age_group_id", null: false
    t.string "name", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["age_group_id"], name: "index_groups_on_age_group_id"
  end

  create_table "playoff_groups", force: :cascade do |t|
    t.bigint "age_group_id", null: false
    t.string "name", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["age_group_id"], name: "index_playoff_groups_on_age_group_id"
  end

  create_table "playoff_matches", force: :cascade do |t|
    t.bigint "age_group_id", null: false
    t.bigint "field_id", null: false
    t.string "home_team_origin_type", null: false
    t.bigint "home_team_origin_id", null: false
    t.string "away_team_origin_type", null: false
    t.bigint "away_team_origin_id", null: false
    t.integer "home_team_origin_rule", null: false
    t.integer "away_team_origin_rule", null: false
    t.bigint "home_team_id"
    t.bigint "away_team_id"
    t.datetime "start_time", null: false
    t.string "title", null: false
    t.integer "home_goals"
    t.integer "away_goals"
    t.boolean "penalties", default: false, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "playoff_group_id"
    t.index ["age_group_id"], name: "index_playoff_matches_on_age_group_id"
    t.index ["away_team_id"], name: "index_playoff_matches_on_away_team_id"
    t.index ["away_team_origin_type", "away_team_origin_id"], name: "index_playoff_matches_on_away_team_origin"
    t.index ["field_id"], name: "index_playoff_matches_on_field_id"
    t.index ["home_team_id"], name: "index_playoff_matches_on_home_team_id"
    t.index ["home_team_origin_type", "home_team_origin_id"], name: "index_playoff_matches_on_home_team_origin"
    t.index ["playoff_group_id"], name: "index_playoff_matches_on_playoff_group_id"
  end

  create_table "teams", force: :cascade do |t|
    t.bigint "club_id", null: false
    t.bigint "group_id", null: false
    t.string "name", null: false
    t.integer "group_stage_number"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "lot"
    t.index ["club_id"], name: "index_teams_on_club_id"
    t.index ["group_id"], name: "index_teams_on_group_id"
  end

  create_table "tournaments", force: :cascade do |t|
    t.string "name", null: false
    t.date "start_date", null: false
    t.integer "days", default: 1, null: false
    t.string "location", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "access_key"
    t.string "address"
    t.integer "match_minutes", default: 45, null: false
    t.integer "equal_points_rule", default: 0, null: false
    t.string "results_access_key"
    t.integer "visibility", default: 2, null: false
    t.boolean "cancelled", default: false, null: false
    t.boolean "test", default: false, null: false
    t.bigint "club_id"
    t.string "slug"
    t.index ["club_id"], name: "index_tournaments_on_club_id"
    t.index ["slug"], name: "index_tournaments_on_slug", unique: true
  end

  add_foreign_key "age_groups", "tournaments"
  add_foreign_key "fields", "tournaments"
  add_foreign_key "group_stage_matches", "fields"
  add_foreign_key "group_stage_matches", "groups"
  add_foreign_key "group_stage_matches", "teams", column: "away_team_id"
  add_foreign_key "group_stage_matches", "teams", column: "home_team_id"
  add_foreign_key "playoff_groups", "age_groups"
  add_foreign_key "playoff_matches", "fields"
  add_foreign_key "playoff_matches", "playoff_groups"
  add_foreign_key "playoff_matches", "teams", column: "away_team_id"
  add_foreign_key "playoff_matches", "teams", column: "home_team_id"
  add_foreign_key "teams", "clubs"
  add_foreign_key "teams", "groups"
  add_foreign_key "tournaments", "clubs"
end
