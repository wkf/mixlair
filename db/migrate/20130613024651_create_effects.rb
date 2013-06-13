class CreateEffects < ActiveRecord::Migration
  def change
    create_table :effects do |t|
      t.integer :track_id

      t.float :bypass
      t.float :threshold
      t.float :release
      t.float :makeup_gain
      t.float :attack
      t.float :ratio
      t.float :knee
      t.float :automakeup
      t.float :feedback
      t.float :delay
      t.float :depth
      t.float :rate
      t.float :intensity
      t.float :stereoPhase
      t.float :delay_time
      t.float :cutoff
      t.float :wet_level
      t.float :dry_level
      t.float :high_cut
      t.float :low_cut

      t.timestamps
    end
  end
end
