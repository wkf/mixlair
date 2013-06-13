# encoding: UTF-8
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
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20130613022332) do

  create_table "mixes", :force => true do |t|
    t.string   "name"
    t.text     "description"
    t.decimal  "volume"
    t.decimal  "tempo"
    t.datetime "created_at",  :null => false
    t.datetime "updated_at",  :null => false
    t.integer  "user_id"
  end

  create_table "regions", :force => true do |t|
    t.string   "name"
    t.boolean  "fade_in"
    t.boolean  "fade_out"
    t.float    "start"
    t.float    "start_offset"
    t.float    "stop_offset"
    t.float    "duration"
    t.datetime "created_at",   :null => false
    t.datetime "updated_at",   :null => false
    t.integer  "track_id"
  end

  create_table "tracks", :force => true do |t|
    t.string   "name"
    t.boolean  "muted"
    t.boolean  "soloed"
    t.float    "volume"
    t.float    "pan"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
    t.integer  "mix_id"
  end

  create_table "users", :force => true do |t|
    t.string   "email",                  :default => "", :null => false
    t.string   "encrypted_password",     :default => "", :null => false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          :default => 0
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.datetime "created_at",                             :null => false
    t.datetime "updated_at",                             :null => false
  end

  add_index "users", ["email"], :name => "index_users_on_email", :unique => true
  add_index "users", ["reset_password_token"], :name => "index_users_on_reset_password_token", :unique => true

end
