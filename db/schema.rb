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

ActiveRecord::Schema.define(version: 2019_02_02_173609) do

  create_table "age_groups", force: :cascade do |t|
    t.integer "tournament_id", null: false
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
    t.integer "tournament_id", null: false
    t.string "name", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["tournament_id"], name: "index_fields_on_tournament_id"
  end

  create_table "groups", force: :cascade do |t|
    t.integer "age_group_id", null: false
    t.string "name", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["age_group_id"], name: "index_groups_on_age_group_id"
  end

  create_table "teams", force: :cascade do |t|
    t.integer "club_id", null: false
    t.integer "group_id", null: false
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
  end

end
