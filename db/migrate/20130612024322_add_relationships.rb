class AddRelationships < ActiveRecord::Migration
  def change
    add_column :tracks, :mix_id, :integer
    add_column :regions, :track_id, :integer
  end
end
