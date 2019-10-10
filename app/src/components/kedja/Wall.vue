<template>
  <div class="Wall" v-if="wall">

    <div class="wallHeader">

      <drop-down :items="[{label: 'Radera vägg', f: removeWall }]">
        <EditableInput v-model="wall.data.title" tag="h2" @change="updateTitle($event)"></EditableInput> &#9663;
      </drop-down>

      <!-- FIXME: This should be read from acl instead + handled properly. It's only a stub. -->
      <drop-down :items="aclOptions">
        {{aclNames[wall.data.acl_name]}} &#9663;
      </drop-down>

      <!--label @click.stop>
        <input type="checkbox" v-model="filterCards" />
        Filtrera kort i vald kedja
      </label-->
      <card-filter @click.native.stop></card-filter>

      <div class="users" v-show="false"><!-- DISABLED FOR NOW -->
        <user-button :user="currentUser" class="self" small @click="openUserModal(currentUser)" />
        <user-button v-for='(user, i) in otherUsers' :key="user.rid" :color="userColor(i)" :user="user" small @click="openUserModal(user)" />
        <button class="add-user-button" @click="openUserAdminModal">+</button>
      </div>

    </div>

    <div class="wallContent" ref="wallContent">
      <div id="collections" ref="colls">

        <div class="horisontal-scroll-wrapper">
          <collections ref="collections" :collections="collections" :wall="wall" :prid="rid" @mounted="collectionsMounted"></collections>
          <connections ref="connections" :collectionsElement="collectionsElement" :wall="wall" v-if="relations" :connections="relations" class="connections"></connections>
        </div>

      </div>
    </div>

    <div class="wallFooter">
    </div>

  </div>
  <div v-else>
    Loading....
  </div>
</template>

<script>

import { mapState, mapGetters, mapActions } from 'vuex'
import { kedjaAPI, eventBus, getUserColor, openDeleteDialog } from '@/utils'

import UserButton from '@/components/kedja/widgets/UserButton'
import WallUserAdmin from './modals/WallUserAdmin'
import WallUserInfo from './modals/WallUserInfo'
import DropDown from '@/components/DropDown'
import CardFilter from '@/components/kedja/widgets/CardFilter'
import Collections from './Collections'
import Connections from './Connections'
import EditableInput from '@/components/general/EditableInput'

const aclNames = {
  private_wall: 'Privat vägg',
  public_wall: 'Publik vägg'
}

export default {
  name: 'Wall',
  components: {
    UserButton,
    DropDown,
    CardFilter,
    Collections,
    Connections,
    EditableInput
  },
  data () {
    return {
      aclNames,
      collectionsElement: undefined
    }
  },
  props: {
    rid: Number,
    wall: Object
  },
  computed: {
    collections () {
      return this.getWallCollections(this.wall)
    },
    relations () {
      return this.wall.relations
    },
    users () {
      return this.getUsers(this.wall.userList)
    },
    otherUsers () {
      return this.users.filter(user => user.rid !== this.currentUser.rid)
    },
    aclOptions () {
      return Object.keys(aclNames)
        .filter(key => this.wall.data.acl_name !== key)
        .map(aclName => {
          return {
            label: aclNames[aclName],
            f: this.setWallACL,
            args: {wall: this.wall, aclName}
          }
        })
    },
    ...mapState('walls', ['walls']),
    ...mapState(['userState', 'filterCards']),
    ...mapGetters('users', ['currentUser', 'getUsers']),
    ...mapGetters('walls', ['getWallCollections'])
  },
  methods: {
    userColor (index) {
      return getUserColor(index)
    },
    openUserModal (user) {
      eventBus.$emit('modalOpen', {component: WallUserInfo, data: {user, wall: this.wall}})
    },
    openUserAdminModal (user) {
      eventBus.$emit('modalOpen', {component: WallUserAdmin, data: {users: this.getUsers().filter(user => user.rid !== this.currentUser.rid), wall: this.wall}})
    },
    removeWall () {
      // this.$router.push({ name: 'ViewWallList', params: {}  })
      openDeleteDialog({
        message: 'Är du säker på att du vill radera väggen och dess innehåll?',
        action: () => {
          kedjaAPI.delete('walls/' + this.rid)
            .then(response => {
              this.$router.push({name: 'Walls'})
            })
        }
      })
    },
    updateTitle (title) {
      kedjaAPI.put('walls/' + this.rid, {title})
    },
    redrawConnections () {
      if (this.$refs.connections) {
        this.$refs.connections.redraw()
      }
    },
    collectionsMounted () {
      this.$refs.colls.addEventListener('scroll', this.redrawConnections)
      this.collectionsElement = this.$refs.collections.$el
    },
    ...mapActions('walls', ['setWallACL'])
  },
  created () {
    eventBus.$on('collectionCreated', () => {
      this.$nextTick(() => {
        document.activeElement.scrollIntoView({behavior: 'smooth', inline: 'start'})
      })
    })
    eventBus.$on('collectionRemoved', () => {
      this.$nextTick(() => {
        document.querySelector('#collections .horisontal-scroll-wrapper').scrollIntoView({behavior: 'smooth', inline: 'end'})
      })
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.Wall{

  /* LAYOUT */
  display: flex;
  flex-direction: column;

  /* STYLING */
  overflow-x: hidden;

}

.wallHeader{
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 1em 0 1em 0;
}

.wallHeader .users {
    margin-left: 24px;
}

.wallHeader > *{
  margin-right: 50px;
}

.wallContent{
  /* LAYOUT */
  display: flex;
  flex-direction: row;

  flex: 1;
  overflow: hidden;
}

#collections{
  display: flex;
  flex-direction: row;
  overflow-x: auto;
  scroll-behavior: smooth;
  overflow-y: hidden;
  flex: 1;
}

.horisontal-scroll-wrapper{
  display: flex;
  flex-direction: row;
  position: relative;
}

.connections{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

</style>
<style lang="sass">
.Wall
  .add-user-button
      width: 20px
      height: 20px
      font-size: 12px
      font-weight: 700
      text-align: center
      color: #000
      padding: 0
</style>
