<template>
  <div class="app-container">
    <div style="margin: 0 0 2% 0">
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="searchSeen = !searchSeen"
      >
        查找
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        添加
      </el-button>
    </div>

    <div class="filter-container" style="margin: 0 0 2% 0" v-if="searchSeen">
      <!-- 第一个查找框 -->
      <el-input
        v-model="listQuery.name"
        placeholder="事件名称"
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />

      <!-- 第二个查找框 -->
      <el-input
        v-model="listQuery.content"
        placeholder="详细内容"
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.chaptername"
        placeholder="章节名称 "
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <!--<el-select v-model="listQuery.importance" placeholder="Imp" clearable style="width: 90px" class="filter-item">
          <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item" />
        </el-select>-->
      <!--<el-select v-model="listQuery.type" placeholder="Type" clearable class="filter-item" style="width: 130px">
          <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key" />
        </el-select>-->
      <el-select
        v-model="listQuery.sort"
        style="width: 140px"
        class="filter-item"
        @change="handleFilter"
      >
        <el-option
          v-for="item in sortOptions"
          :key="item.key"
          :label="item.label"
          :value="item.key"
        />
      </el-select>

      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        提交</el-button
      >

      <!--<el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        下载表格
        </el-button>-->
      <!--<el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">
          展开列表
        </el-checkbox>-->
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
      @sort-change="sortChange"
    >
      <el-table-column
        label="ID"
        prop="id"
        sortable="custom"
        align="center"
        width="80"
        :class-name="getSortClass('id')"
      >
        <template slot-scope="{ row }">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="父级id" width="110px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.pid }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="分类图片" width="110px" align="center">
          <template slot-scope="{row}">
          <el-avatar :src="row.image"></el-avatar>
          </template>
        </el-table-column> -->
      <el-table-column label="章节名称" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.chaptername }}</span>
        </template>
      </el-table-column>
      <el-table-column label="级别" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.level }}</span>
        </template>
      </el-table-column>
      <el-table-column label="事件名称" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="详细内容" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.content }}</span>
          </template>
        </el-table-column> -->

      <!-- <el-table-column label="关键字" width="110px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.keywords }}</span>
          </template>
        </el-table-column> -->
      <!-- <el-table-column
        prop="showStatus"
        header-align="center"
        align="center"
        label="显示状态" width="110px">
        <template slot-scope="{row}">
          <el-switch
            v-model="row.isshow"
            :active-value="row.isshow"
            active-text="启用"
            active-color="#13ce66"
            inactive-color="#ff4949"
            >
          </el-switch> -->

      <!-- {{row.isshow}}
          {{typeof(row.isshow)}} -->
      <!-- </template>
      </el-table-column> -->

      <el-table-column label="创建日期" align="center">
        <template slot-scope="{ row }">
          <span>{{
            row.createtime | parseTime(row.createtime, "{y}-{m}-{d} {h}:{i}")
          }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
        align="center"
        width="280"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row, $index }">
          <el-button type="primary" size="mini" @click="handleUplod(row)">
            添加视频
          </el-button>
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            修改
          </el-button>
          <!--<el-button v-if="row.status!='published'" size="mini" type="success" @click="handleModifyStatus(row,'published')">
              详细
            </el-button>-->
          <!--<el-button v-if="row.status!='draft'" size="mini" @click="handleModifyStatus(row,'draft')">
              Draft
            </el-button>-->
          <el-button
            v-if="row.status != 'deleted'"
            size="mini"
            type="danger"
            @click="handleDelete(row, $index)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item label="所属上级" prop="fid">
          <el-cascader
            :options="optionsdata"
            :props="{
              checkStrictly: true,
              label: 'chaptername',
              value: 'id',
              children: 'Children',
              emitPath: 'false',
            }"
            clearable
            v-model="temp.pid"
            value-key="id"
            @focus="groupoption"
            @onchange="groupoption"
            placeholder="顶级菜单"
          >
          </el-cascader>
        </el-form-item>
        <!--<el-form-item label="Date" prop="timestamp">
            <el-date-picker v-model="temp.timestamp" type="datetime" placeholder="Please pick a date" />
          </el-form-item>-->
        <!-- <el-form-item label="分类标题" prop="title">
            <el-input v-model="temp.title" />
          </el-form-item> -->
        <!-- <el-form-item label="分类图片" prop="image">
            <el-upload
              class="avatar-uploader"
              action="http://file.988cj.com/group1/upload"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="this.temp.image" :src="temp.image" class="avatar" />

              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <el-input v-model="temp.image" type="hidden" />
          </el-form-item> -->
        <el-form-item label="章节名称" prop="chaptername">
          <el-input v-model="temp.chaptername" />
        </el-form-item>
        <el-form-item label="级别" prop="level">
          <el-input type="number" v-model.number="temp.level" />
        </el-form-item>
        <el-form-item label="事件名称" prop="level">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="详细内容" prop="content">
          <!-- <el-input type="textarea" v-model="temp.content" /> -->
          <quill-editor
            ref="myQuillEditor"
            v-model="temp.content"
            style="width: 180%; height: 120%; box-sizing: border-box"
          />
          <!-- <template>
              <div class="editor-container">

      <markdown-editor v-model="temp.content" height="400px" />
    </div>
  </template> -->
        </el-form-item>

        <el-form-item label="是否显示" prop="isshow">
          <el-switch
            v-model="temp.isshow"
            :active-value="1"
            :inactive-value="0"
          >
          </el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false"> 取消 </el-button>
        <el-button
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
        >
          提交
        </el-button>
      </div>
    </el-dialog>
    <!-- 212 -->
    <el-dialog :visible.sync="dialogFormVideo">
      <el-form
        ref="dataForm1"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item label="视频名称">
          <el-input v-model="videotemp.title" />
        </el-form-item>

        <el-upload
          class="upload-demo"
          :action="action"
          :headers="headerObj"
          :on-success="handleSuccess"
          :limit="5"
          list-type="video"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">
            只能上传jpg/png文件，且不超过500kb
          </div>
        </el-upload>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVideo = false"> 取消 </el-button>
        <el-button type="primary" @click="wanghuiqing()"> 提交 </el-button>
      </div>
    </el-dialog>
    <!-- 添加视频尾巴 -->
    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table
        :data="pvData"
        border
        fit
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false"
          >Confirm</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}
.avatar {
  width: 100px;
  height: 100px;
  display: block;
}
</style>
<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import { quillEditor, Quill } from "vue-quill-editor";
import {
  getlist,
  getoptions,
  add,
  edit,
  del,
  get,
  addvdo,
} from "@/api/book/index";
import waves from "@/directive/waves"; // waves directive 点击水波纹
import { parseTime } from "@/utils";
import { getToken } from "@/utils/auth";
// import MarkdownEditor from '@/components/MarkdownEditor'
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination

// arr to obj, such as { CN : "China", US : "USA" }

import request from "@/utils/request";

export default {
  //讲师列表

  name: "",
  components: { Pagination, quillEditor },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "info",
        deleted: "danger",
      };
      return statusMap[status];
    },
    parseTime(time, cFormat) {
      return parseTime(time, cFormat);
    },
  },
  data() {
    return {
      searchSeen: false,
      tableKey: 0,
      list: null,
      total: 0,
      action: `${process.env.VUE_APP_BASE_API}/admin/mp4_upload`,
      headerObj: {
        Authorization: getToken(),
      },
      listLoading: true,

      listQuery: {
        limit: 20,
        page: 1,
        importance: undefined,
        username: undefined,
        type: undefined,
        sort: "+id",
        chaptername: "", // 新增的title搜索条件  王辉庆编写
        name: "", // 新增的事件名称的搜索条件
        // content: '', // 新增详细内容的搜索条件
      },
      importanceOptions: [1, 2, 3],
      sortOptions: [
        { label: "ID 升序", key: "+id" },
        { label: "ID 倒序", key: "-id" },
      ],
      statusOptions: ["published", "draft", "deleted"],
      showReviewer: false,
      temp: {
        id: undefined,
        pid: undefined,
        chaptername: "",
        name: "",
        level: undefined,
        content: "",
      },
      videotemp: {
        title: "",
        fileurl: [],
        book_id: undefined,
      },
      imgurl: "",
      dialogFormVisible: false,
      dialogFormVideo: false,
      dialogStatus: "",
      textMap: {
        update: "编辑",
        create: "新增",
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [
          { required: true, message: "type is required", trigger: "change" },
        ],
        timestamp: [
          {
            type: "date",
            required: true,
            message: "timestamp is required",
            trigger: "change",
          },
        ],
        title: [
          { required: true, message: "分类标题不能为空", trigger: "blur" },
        ],
      },
      downloadLoading: false,
      optionsdata: [],
    };
  },
  created() {
    this.getList(), this.groupoption();
  },
  methods: {
    handleSuccess(res, file, fileList) {
      // // 图片上传服务器后的回调
      // console.log(res);
      // if (res.code === 200) {
      //   this.videotemp.fileurl = res.data; // 以方法的形式调用就可以了，每一张图片都会到这个方法里
      //   this.videotemp.fileurl.push({
      //     title: this.videotemp.title,
      //     url: res.data,
      //   });
      //   this.videotemp.title = "";
      // } else {
      //   this.delShowFile(file, fileList);
      //   this.$message.error("上传服务器失败!");
      // }
      // 图片上传服务器后的回调
      console.log(res);
      if (res.code === 200) {
        if (!Array.isArray(this.videotemp.fileurl)) {
          this.videotemp.fileurl = [];
        }
        this.videotemp.fileurl.push({
          title: this.videotemp.title,
          url: res.data,
        });
        
      } else {
        this.delShowFile(file, fileList);
        this.$message.error("上传服务器失败!");
      }
    },
    getList() {
      this.listLoading = true;
      getlist(this.listQuery).then((response) => {
        this.list = response.data.listdata;
        this.total = response.data.totalnum;

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 1000);
      });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
      this.groupoption();
    },
    // handleModifyStatus(row, status) {
    //   this.$message({
    //     message: '操作Success',
    //     type: 'success'
    //   })
    //   row.status = status
    // },
    sortChange(data) {
      const { prop, order } = data;
      if (prop === "id") {
        this.sortByID(order);
      }
    },
    sortByID(order) {
      if (order === "ascending") {
        this.listQuery.sort = "+id";
      } else {
        this.listQuery.sort = "-id";
      }
      this.handleFilter();
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        pid: undefined,
        chaptername: "",
        name: "",
        level: undefined,
        content: "",
      };
    },
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    wanghuiqing() {
      // console.log(this.videotemp)
      // addvdo(this.videotemp)
      // .then(response => {
      //   // 处理成功情况，更新 UI 或显示成功消息
      //   console.log('视频添加成功:', response);
      //   this.getList(); // 假设这个方法在添加新视频后更新视频列表
      //   this.$message.success('视频添加成功！'); // 使用 element-ui message 组件显示成功消息
      //   this.videotemp = {
      //   title: "",
      //   fileurl: [],
      //   book_id: undefined,
      // };
      // })
      // .catch(error => {
      //   // 处理错误情况，显示错误消息或记录错误日志
      //   console.error('添加视频时出错:', error);
      //   this.$message.error('视频添加失败，请重试！'); // 使用 element-ui message 组件显示错误消息
      // });
      this.videotemp.fileurl.forEach((video) => {
        addvdo({
          title: video.title,
          fileurl: video.url,
          book_id: this.videotemp.book_id,
        })
          .then((response) => {
            // 处理成功情况
            console.log("视频添加成功:", response);
            this.getList(); // 假设这个方法在添加新视频后更新视频列表
            this.$message.success("视频添加成功！");
          })
          .catch((error) => {
            // 处理错误情况
            console.error("添加视频时出错:", error);
            this.$message.error("视频添加失败，请重试！");
          });
      });
    },
    createData() {
      if (typeof this.temp.pid == "undefined" || this.temp.pid == 0) {
        this.temp.pid = 0;
        // console.log(this.temp.pid)
      } else {
        let newpid = this.temp.pid.pop();
        this.temp.pid = newpid;
      }
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          add(this.temp)
            .then((response) => {
              if (response.code == 200) {
                // this.list.unshift(this.temp)
                this.dialogFormVisible = false;
                this.$notify({
                  title: "Success",
                  message: "创建成功",
                  type: "success",
                  duration: 2000,
                });
                this.getList();
              } else {
                this.$message.error("数据添加失败！");
                // this.$message.error('添加数据失败！');
                this.dialogFormVisible = false;
              }
            })
            .catch((error) => {
              console.log(error);
            });
        }
      });
    },
    groupoption() {
      getoptions()
        .then((response) => {
          this.optionsdata = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    handleUplod(row) {
      console.log(row);
      this.videotemp.book_id = row.id;
      this.dialogFormVideo = true;
      this.$nextTick(() => {
        this.$refs["dataForm1"].clearValidate();
      });
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row); // copy obj
      get(row)
        .then((response) => {
          // console.log(response)
          console.log(response.data.content);
          this.temp.content = response.data.content;
        })
        .catch((error) => {
          console.log(error);
        });
      this.temp.timestamp = new Date(this.temp.timestamp);
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    updateData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          //处理父级ID
          if (typeof this.temp.pid == "undefined" || this.temp.pid == 0) {
            //判断是否为空
            this.temp.pid = 0;
            // console.log(this.temp.pid)
          } else {
            if (Array.isArray(this.temp.pid) == true) {
              //判断是否更新的为数组，为数组就取最后一个作为他的父级ID
              let newpid = this.temp.pid.pop();
              this.temp.pid = newpid;
            }
          }
          const tempData = Object.assign({}, this.temp);
          tempData.timestamp = +new Date(tempData.timestamp); // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          edit(tempData).then(() => {
            const index = this.list.findIndex((v) => v.id === this.temp.id);
            this.list.splice(index, 1, this.temp);
            this.dialogFormVisible = false;
            this.$notify({
              title: "Success",
              message: "更新 Successfully",
              type: "success",
              duration: 2000,
            });
            this.getList();
          });
        }
      });
    },
    /* 删除按钮*/
    handleDelete(row, index) {
      this.$confirm("确定要删除【" + row.title + "】吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        del(row).then((response) => {
          // alert(index);
          // console.log(response);
          if (response.code == 200) {
            this.dialogFormVisible = false;
            this.$notify({
              title: "Success",
              message: "数据删除成功！ Successfully",
              type: "success",
              duration: 2000,
            });
            this.list.splice(index, 1);
          } else {
            this.$message.error("删除数据失败！");
            // this.reload();
          }
        });
      });
    },
    //头像上传
    handleAvatarSuccess(res, file) {
      this.imgurl = URL.createObjectURL(file.raw);
      this.temp.image = res;
      // console.log(this.temp.image)
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpg";
      const isPng = file.type === "image/png";
      const isJpeg = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG & !isPng & !isJpeg) {
        this.$message.error("上传头像图片只能是图片格式!");
        return false;
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
        return false;
      }
      return true;
    },
    handleFetchPv(pv) {
      fetchPv(pv).then((response) => {
        this.pvData = response.data.pvData;
        this.dialogPvVisible = true;
      });
    },
    handleDownload() {
      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then((excel) => {
        const tHeader = ["timestamp", "title", "type", "importance", "status"];
        const filterVal = [
          "timestamp",
          "title",
          "type",
          "importance",
          "status",
        ];
        const data = this.formatJson(filterVal);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: "table-list",
        });
        this.downloadLoading = false;
      });
    },
    formatJson(filterVal) {
      return this.list.map((v) =>
        filterVal.map((j) => {
          if (j === "timestamp") {
            return parseTime(v[j]);
          } else {
            return v[j];
          }
        })
      );
    },
    getSortClass: function (key) {
      const sort = this.listQuery.sort;
      return sort === `+${key}` ? "ascending" : "descending";
    },
  },
};
</script>
