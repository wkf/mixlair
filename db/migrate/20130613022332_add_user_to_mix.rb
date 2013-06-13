class AddUserToMix < ActiveRecord::Migration
  def change
    add_column :mixes, :user_id, :integer
  end
end
