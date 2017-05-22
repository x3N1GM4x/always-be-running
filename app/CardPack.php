<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class CardPack extends Model
{
    protected $fillable = ['id', 'cycle_code', 'name', 'position', 'date_release', 'usable', 'cycle_position'];
    public $timestamps = false;
    public $incrementing = false;
    protected $hidden = ['cycle_code', 'position', 'date_release', 'usable', 'cycle_position'];

    public function cycle() {
        return $this->hasOne(CardCycle::class, 'id', 'cycle_code');
    }
}
