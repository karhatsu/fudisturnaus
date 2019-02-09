# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2019_02_04_171843) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "age_groups", force: :cascade do |t|
    t.bigint "tournament_id", null: false
    t.string "name", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["tournament_id"], name: "index_age_groups_on_tournament_id"
  end

  create_table "clubs", force: :cascade do |t|
    t.string "name", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "fields", force: :cascade do |t|
    t.bigint "tournament_id", null: false
    t.string "name", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["tournament_id"], name: "index_fields_on_tournament_id"
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

  create_table "teams", force: :cascade do |t|
    t.bigint "club_id", null: false
    t.bigint "group_id", null: false
    t.string "name", null: false
    t.integer "group_stage_number"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
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
  end

  add_foreign_key "age_groups", "tournaments"
  add_foreign_key "fields", "tournaments"
  add_foreign_key "group_stage_matches", "fields"
  add_foreign_key "group_stage_matches", "groups"
  add_foreign_key "group_stage_matches", "teams", column: "away_team_id"
  add_foreign_key "group_stage_matches", "teams", column: "home_team_id"
  add_foreign_key "groups", "age_groups"
  add_foreign_key "teams", "clubs"
  add_foreign_key "teams", "groups"
end
